package com.bkopysc.foodstash.service.stashes;

import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.stashes.*;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface StashesService {

    List<StashDetailsDto> getStashListByCurrentUser(Authentication authentication);
    StashDetailsDto getStash(Long id, Authentication authentication);
    SimpleResponse createStash(StashCreateDto stash, Authentication authentication);
    StashDetailsDto editStash(Long id, StashEditDto stashEditDto, Authentication authentication);
    SimpleResponse deleteStash(Long id, Authentication authentication);

    SimpleResponse createShareStashToken(Long id, StashShareDto stashShareDto, Authentication authentication);
    SimpleResponse executeStashShare(String tokenValue, Authentication authentication);
    List<StashShareDetailDto> getPendingShareRequests(Long stashId, Authentication authentication);
    SimpleResponse cancelPendingShareRequest(Long stashId, StashShareDto stashShareDto, Authentication authentication);

    List<StashCollaboratorDto> getStashCollaborators(Long stashId, Authentication authentication);
}
