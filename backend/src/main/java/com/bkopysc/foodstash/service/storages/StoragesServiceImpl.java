package com.bkopysc.foodstash.service.storages;

import com.bkopysc.foodstash.domain.*;
import com.bkopysc.foodstash.dto.alerts.AlertDetailsDto;
import com.bkopysc.foodstash.dto.storages.*;
import com.bkopysc.foodstash.repository.*;
import com.bkopysc.foodstash.service.alerts.AlertsServiceImpl;
import com.bkopysc.foodstash.service.users.UserServiceImpl;
import com.bkopysc.foodstash.utils.calcs.FoodAlertCalcUtil;
import com.bkopysc.foodstash.utils.calcs.FoodStatusCalcUtil;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Source;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.print.attribute.standard.Destination;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StoragesServiceImpl implements StoragesService {

    private final UserRepository userRepository;
    private final StashRepository stashRepository;

    private final FoodRepository foodRepository;

    private final StorageRepository storageRepository;
    private final AlertRepository alertRepository;

    private final UserServiceImpl userService;

    private final ModelMapper modelMapper;

    private final AlertsServiceImpl alertsService;

    private static final FoodAlertCalcUtil foodAlertCalcUtil = new FoodAlertCalcUtil();

    private final String USER_NOT_ALLOWED = "user.auth.error.notAllowed";
    private final String STASH_NOT_EXIST = "stashes.error.notExist";
    private final String STORAGE_NOT_EXIST = "storages.error.notExist";

    @Override
    public StorageComplexDto addStorage(Long stashId, StorageCreateDto storageCreateDto, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        Stash stash = stashRepository.findById(stashId).orElseThrow(() -> new BadRequestException(STASH_NOT_EXIST));

        if (!stash.getOwnerId().equals(user.getId())) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        Storage storage = new Storage();
        storage.setStorageType(storageCreateDto.getStorageType());
        storage.setStash(stash);
        storage.setName(storageCreateDto.getName());

        Alert alert = new Alert();
        storage.setAlert(alert);
        alert.setStorage(storage);
        //stash.getStorages().add(storage

        storageRepository.save(storage);
        alertRepository.save(alert);


        return modelMapper.map(storage, StorageComplexDto.class);
    }

    @Override
    public StorageDetailDto editStorage(Long storageId, StorageEditDto storageEditDto, Authentication authentication) {

        User user = userService.getCurrentUser(authentication);
        Storage storage = storageRepository.findById(storageId).orElseThrow(() -> new BadRequestException(STORAGE_NOT_EXIST));

        Stash stash = stashRepository.findByStorages(storage);
        if (!stash.getOwnerId().equals(user.getId())) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        storage.setName(storageEditDto.getName());
        storage.setStorageType(storageEditDto.getStorageType());

        storageRepository.save(storage);

        return modelMapper.map(storage, StorageDetailDto.class);
    }

    @Override
    public StorageComplexDto getComplexStorage(Long storageId, Authentication authentication) {
        Storage storage = getRawUserStorage(authentication, storageId);


        StorageComplexDto storageComplex = modelMapper.map(storage, StorageComplexDto.class);

        storageComplex.setActiveFoodStats(foodRepository.countActiveByStorage(storageId));
//       create alerts one per day, than fetch from DB
        AlertDetailsDto alertDetailsDto = alertsService.executeAndGetAlert(storageId, false);
        storageComplex.setAlertsStats(alertDetailsDto.getNumberOfAlerts());
        String ownerUsername = userService.getUsernameById(storage.getStash().getOwnerId());
        storageComplex.setOwnerUsername(ownerUsername);

        return storageComplex;
    }

    @Override
    public List<StorageComplexDto> getUserStorages(Authentication authentication) {


        List<Storage> storages = getRawUserStorages(authentication);

        List<StorageComplexDto> storageComplexDtos = storages.stream()
                .map(s -> {
                    StorageComplexDto storageComplexDto = modelMapper.map(s, StorageComplexDto.class);
                    storageComplexDto.setActiveFoodStats(foodRepository.countActiveByStorage(storageComplexDto.getId()));
                    //TODO generate alerts one per day or by click
                    AlertDetailsDto alertDetailsDto = alertsService.executeAndGetAlert(s.getId(), false);
                    storageComplexDto.setAlertsStats(alertDetailsDto.getNumberOfAlerts());
                    return storageComplexDto;
                }).toList();

        return storageComplexDtos;
    }

    @Override
    public StorageStashDetailDto getStorageDetailsWithStash(Long storageId, Authentication authentication) {

        Storage storage = getRawUserStorage(authentication, storageId);
        return modelMapper.map(storage, StorageStashDetailDto.class);
    }

    @Override
    public StorageDetailDto getStorage(Long storageId, Authentication authentication) {

        Storage storage = getRawUserStorage(authentication, storageId);
        return modelMapper.map(storage, StorageDetailDto.class);
    }

    @Override
    public List<Storage> getRawUserStorages(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        List<Stash> stashList = stashRepository.findAllByUsedByUsers(user);
        List<Storage> storageList = new ArrayList<>();

        stashList.forEach(stash -> {
            storageList.addAll(stash.getStorages());
        });

        return storageList;
    }


    @Override
    public List<StorageStashDetailDto> getStoragesInStashByStorageId(Long storageId, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Storage storage = storageRepository.findById(storageId).orElseThrow(() -> new BadRequestException(STORAGE_NOT_EXIST));

        Stash stash = stashRepository.findByStorages(storage);
        if (!stash.getUsedByUsers().stream().anyMatch(user1 -> user1.getId().equals(user.getId()))) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        Set<Storage> storageSet = stash.getStorages();

        return storageSet.stream()
                .map(s -> modelMapper.map(s, StorageStashDetailDto.class))
                .toList();

    }

    @Override
    public Storage getRawUserStorage(Authentication authentication, Long storageId) {
        User user = userService.getCurrentUser(authentication);
        Storage storage = storageRepository.findById(storageId).orElseThrow(() -> new BadRequestException(STORAGE_NOT_EXIST));

        Stash stash = stashRepository.findByStorages(storage);
        if (stash.getUsedByUsers().stream().noneMatch(user1 -> user1.getId().equals(user.getId()))) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }
        return storage;
    }

}
