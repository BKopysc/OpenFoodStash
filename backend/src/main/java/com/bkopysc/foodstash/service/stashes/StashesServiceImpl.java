package com.bkopysc.foodstash.service.stashes;

import com.bkopysc.foodstash.domain.*;
import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.stashes.*;
import com.bkopysc.foodstash.dto.storages.StorageComplexDto;
import com.bkopysc.foodstash.dto.storages.StorageDetailDto;
import com.bkopysc.foodstash.repository.*;
import com.bkopysc.foodstash.service.mailing.EmailService;
import com.bkopysc.foodstash.service.storages.StoragesService;
import com.bkopysc.foodstash.service.users.UserService;
import com.bkopysc.foodstash.service.users.UserServiceImpl;
import com.bkopysc.foodstash.utils.HashUtil;
import com.bkopysc.foodstash.utils.RandomStringGenerator;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.expression.ExpressionException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StashesServiceImpl implements StashesService {

    private final UserRepository userRepository;
    private final StashRepository stashRepository;

    private final StorageRepository storageRepository;
    private final AlertRepository alertRepository;
    private final StoragesService storagesService;

    private final StashShareTokenRepository stashShareTokenRepository;

    private final UserServiceImpl userService;

    private final ModelMapper modelMapper;

    private final static HashUtil hashUtil = new HashUtil();
    private final static RandomStringGenerator randStrGen = new RandomStringGenerator();

    private final MessageSource messageSource;
    private final EmailService emailService;

    private final String INVITATION_BODY = "mail.stashInvitation.body";
    private final String INVITATION_SUBJECT = "mail.stashInvitation.subject";
    private final String INVITATION_SUCCESS_BODY = "mail.stashInvitationSuccess.body";
    private final String INVITATION_SUCCESS_SUBJECT = "mail.stashInvitationSuccess.subject";
    private final String MAIL_FOOTER = "mail.footer";
    private final String USER_NOT_ALLOWED = "user.auth.error.notAllowed";
    private final String STASH_NOT_EXIST = "stashes.error.notExist";
    private final String LINK_INVALID = "link.error.invalid";
    private final String STORAGES_AT_LEAST_ONE = "storages.error.atLeasOne";
    private final String INVITED_EMAIL_IS_YOURS = "stashes.error.ownerEmail";
    private final String INVITED_USER_NOT_FOUND = "stashes.error.invitedUserNotFound";
    private final String USER_IS_ALREADY_COLLABORATOR = "stashes.error.alreadyShared";
    private final String NOT_INVITED_USER = "stashes.error.notInvitedUser";
    private final String ALREADY_HAVE_ACCESS = "stashes.error.alreadyAccess";


    @Value("${foodstash.frontend.stashInvitationUrl}")
    private String invitationUrl;

    @Override
    public List<StashDetailsDto> getStashListByCurrentUser(Authentication authentication) {
        com.bkopysc.foodstash.domain.User user = this.userService.getCurrentUser(authentication);


        List<Stash> stashesList = stashRepository.findAllByUsedByUsers(user);
        Map<Long, Set<StorageComplexDto>> compSetMap = new HashMap<>();

        stashesList.stream().forEach(stash -> compSetMap.put(stash.getId(), new HashSet<>()));

        for (StorageComplexDto storageComplexDto : storagesService.getUserStorages(authentication)) {
            if (compSetMap.containsKey(storageComplexDto.getStashId())) {
                compSetMap.get(storageComplexDto.getStashId()).add(storageComplexDto);
            }
        }

        List<StashDetailsDto> stashDetailsDtos = stashesList
                .stream()
                .map(stash -> {
                    StashDetailsDto s = new StashDetailsDto();
                    s.setId(stash.getId());
                    s.setName(stash.getName());
                    s.setOwnerId(stash.getOwnerId());
                    s.setOwnerUsername(userService.getUsernameById(s.getOwnerId()));
                    s.setPersonal(stash.isPersonal());
                    s.setStorages(compSetMap.get(stash.getId()));
                    s.setNumberOfStorages(compSetMap.get(stash.getId()).size());
                    s.setHasWarning(
                            s.getStorages().stream().anyMatch(st -> (st.getAlertsStats() != 0L))
                    );
                    return s;
                }).collect(Collectors.toList());

        return stashDetailsDtos;
    }

    @Override
    public StashDetailsDto getStash(Long id, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        Stash stash = stashRepository.findById(id).orElseThrow(() -> new BadRequestException(STASH_NOT_EXIST));

        if (stash.getUsedByUsers().stream().noneMatch(user1 -> user1.getId().equals(user.getId()))) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        StashDetailsDto stashDetailsDto = modelMapper.map(stash, StashDetailsDto.class);
        stashDetailsDto.setNumberOfStorages(stashDetailsDto.getStorages().size());
        stashDetailsDto.setOwnerUsername(userService.getUsernameById(stashDetailsDto.getOwnerId()));
        return stashDetailsDto;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse createStash(StashCreateDto stash, Authentication authentication) {
        com.bkopysc.foodstash.domain.User user = this.userService.getCurrentUser(authentication);

        Stash newStash = new Stash();
        newStash.setName(stash.getName());
        newStash.setOwnerId(user.getId());
        newStash.setPersonal(stash.isPersonal());

        if (stash.getStorages().isEmpty()) {
            throw new BadRequestException(STORAGES_AT_LEAST_ONE);
        }

        Set<Alert> alertSet = new HashSet<>();

        Set<Storage> storageList = stash.getStorages()
                .stream()
                .map(storageCreateDto -> {
                    Storage storage = new Storage();
                    storage.setStorageType(storageCreateDto.getStorageType());
                    storage.setName(storageCreateDto.getName());
                    storage.setStash(newStash);

                    Alert alert = new Alert();
                    storage.setAlert(alert);
                    alert.setStorage(storage);
                    alertSet.add(alert);

                    return storage;
                })
                .collect(Collectors.toSet());

        newStash.setStorages(storageList);
        user.getUserStashes().add(newStash);

        this.stashRepository.save(newStash);
        this.storageRepository.saveAll(storageList);
        this.alertRepository.saveAll(alertSet);

        return new SimpleResponse(newStash.getId());
    }

    @Override
    public StashDetailsDto editStash(Long id, StashEditDto stashEditDto, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        Stash stash = stashRepository.findById(id).orElseThrow(() -> new BadRequestException(STASH_NOT_EXIST));

        if (!user.getId().equals(stash.getOwnerId())) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        stash.setPersonal(stashEditDto.isPersonal());
        stash.setName(stashEditDto.getName());

        stashRepository.save(stash);

        StashDetailsDto stashDetailsDto = modelMapper.map(stash, StashDetailsDto.class);
        stashDetailsDto.setNumberOfStorages(stashDetailsDto.getStorages().size());
        stashDetailsDto.setOwnerUsername(userService.getUsernameById(stashDetailsDto.getOwnerId()));

        return stashDetailsDto;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse deleteStash(Long id, Authentication authentication) {

        User user = userService.getCurrentUser(authentication);
        Stash stash = stashRepository.findById(id).orElseThrow(() -> new BadRequestException(STASH_NOT_EXIST));

        if (!stash.getOwnerId().equals(user.getId())) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        //TODO b.kopysc: dodaj usuwanie: CASCADE

        return new SimpleResponse("deleted", id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse createShareStashToken(Long id, StashShareDto stashShareDto, Authentication authentication) {

        User user = userService.getCurrentUser(authentication);
        Stash stash = stashRepository.findById(id).orElseThrow(() -> new BadRequestException(STASH_NOT_EXIST));

        if (user.getEmail().equals(stashShareDto.getShareEmail())) {
            throw new BadRequestException(INVITED_EMAIL_IS_YOURS);
        }

        if (stash.getUsedByUsers().stream().noneMatch(user1 -> user1.getId().equals(user.getId()))) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        if (!stash.getOwnerId().equals(user.getId())) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        User invitedUser = userService.getUser(stashShareDto.getShareEmail());

        if (invitedUser == null) {
            throw new BadRequestException(INVITED_USER_NOT_FOUND);
        }

        if (stash.getUsedByUsers().stream().anyMatch(user1 -> user1.getId().equals(invitedUser.getId()))) {
            throw new BadRequestException(USER_IS_ALREADY_COLLABORATOR);
        }

        Optional<StashShareToken> _stashShareToken = stashShareTokenRepository
                .findByInvitedUserAndStash(invitedUser, stash);

        StashShareToken stashShareToken = _stashShareToken.orElseGet(StashShareToken::new);

        stashShareToken.setOwnerUser(user);
        stashShareToken.setInvitedUser(invitedUser);
        stashShareToken.setStash(stash);
        stashShareToken.setActive(true);
        stashShareToken.setPending(true);
        stashShareToken.setToken(randStrGen.getRandomUUID());

        this.stashShareTokenRepository.save(stashShareToken);

        this.sendInvitationMail(user, invitedUser, stashShareToken);

        return new SimpleResponse("Invitation link send");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse executeStashShare(String tokenValue, Authentication authentication) {

        StashShareToken stashShareToken = stashShareTokenRepository.findStashShareTokenByToken(tokenValue)
                .orElseThrow(() -> new BadRequestException(LINK_INVALID));

        Stash stash = stashShareToken.getStash();

        User user = userService.getCurrentUser(authentication);

        if (!stashShareToken.getInvitedUser().getId().equals(user.getId())) {
            throw new BadRequestException(NOT_INVITED_USER);
        }

        if (stash.getUsedByUsers().stream().anyMatch(user1 -> user1.getId().equals(user.getId()))) {
            throw new BadRequestException(ALREADY_HAVE_ACCESS);
        }

        stash.getUsedByUsers().add(user);
        stash.setPersonal(false);
        user.getUserStashes().add(stash);

        stashRepository.save(stash);
        userRepository.save(user);
        stashShareTokenRepository.delete(stashShareToken);

        this.sendInvitationSuccessToOwner(stashShareToken.getOwnerUser(), user);

        return new SimpleResponse("Invitation  completed successfully");
    }

    @Override
    public List<StashShareDetailDto> getPendingShareRequests(Long stashId, Authentication authentication) {

        User user = userService.getCurrentUser(authentication);
        Stash stash = stashRepository.findById(stashId).orElseThrow(() -> new BadRequestException(STASH_NOT_EXIST));

        if (!stash.getOwnerId().equals(user.getId())) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        List<StashShareToken> stashShareTokens =
                stashShareTokenRepository.findAllByStashAndPendingIsTrueAndActiveIsTrue(stash);

        return stashShareTokens.stream()
                .map(stashShareToken -> new StashShareDetailDto(stashShareToken.getInvitedUser().getEmail(),
                        stashShareToken.isPending()))
                .toList();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse cancelPendingShareRequest(Long stashId, StashShareDto stashShareDto, Authentication authentication) {

        User user = userService.getCurrentUser(authentication);
        Stash stash = stashRepository.findById(stashId).orElseThrow(() -> new BadRequestException(STASH_NOT_EXIST));

        if (!stash.getOwnerId().equals(user.getId())) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        User invitedUser = userService.getUser(stashShareDto.getShareEmail());

        if (invitedUser == null) {
            throw new BadRequestException(INVITED_USER_NOT_FOUND);
        }

        StashShareToken stashShareToken = stashShareTokenRepository.findByInvitedUserAndStash(invitedUser, stash)
                .orElseThrow(() -> new BadRequestException(LINK_INVALID));

        stashShareToken.setPending(false);
        stashShareToken.setActive(false);

        stashShareTokenRepository.delete(stashShareToken);

        return new SimpleResponse("Invitation cancelled");
    }

    @Override
    public List<StashCollaboratorDto> getStashCollaborators(Long stashId, Authentication authentication) {

        User user = userService.getCurrentUser(authentication);
        Stash stash = stashRepository.findById(stashId).orElseThrow(() -> new BadRequestException(STASH_NOT_EXIST));

        if (stash.getUsedByUsers().stream().noneMatch(user1 -> user1.getId().equals(user.getId()))) {
            throw new BadRequestException(NOT_INVITED_USER);
        }

        List<StashCollaboratorDto> stashCollaboratorDtos = new ArrayList<>();

        stash.getUsedByUsers().forEach(user1 -> {
                StashCollaboratorDto scd = new StashCollaboratorDto(user1.getEmail(), user1.getId().equals(stash.getOwnerId()));
                if(scd.isOwner()){
                    stashCollaboratorDtos.add(0, scd);
                } else {
                    stashCollaboratorDtos.add(scd);
                }
        });

        return stashCollaboratorDtos;
    }

    private void sendInvitationMail(User ownerUser, User invitedUser, StashShareToken stashShareToken) {
        Locale locale = LocaleContextHolder.getLocale();
        Object[] msgArgs = new Object[]{invitedUser.getProfile().getName(), ownerUser.getProfile().getName(),
                ownerUser.getEmail(), this.invitationUrl + stashShareToken.getToken()};

        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(invitedUser.getEmail())
                .msgBody(messageSource.getMessage(INVITATION_BODY, msgArgs, locale))
                .msgFooter(messageSource.getMessage(MAIL_FOOTER, null, locale))
                .subject(messageSource.getMessage(INVITATION_SUBJECT, null, locale))
                .build();

        emailService.sendUserActionMail(emailDetails);
    }

    private void sendInvitationSuccessToOwner(User ownerUser, User invitedUser) {
        Locale locale = LocaleContextHolder.getLocale();
        Object[] msgArgs = new Object[]{ownerUser.getProfile().getName(), invitedUser.getProfile().getName(),
                invitedUser.getEmail()};

        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(invitedUser.getEmail())
                .msgBody(messageSource.getMessage(INVITATION_BODY, msgArgs, locale))
                .msgFooter(messageSource.getMessage(MAIL_FOOTER, null, locale))
                .subject(messageSource.getMessage(INVITATION_SUBJECT, null, locale))
                .build();

        emailService.sendUserActionMail(emailDetails);
    }

}
