package com.bkopysc.foodstash.service.storages;

import com.bkopysc.foodstash.domain.Storage;
import com.bkopysc.foodstash.dto.storages.*;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface StoragesService {

    StorageComplexDto addStorage(Long stashId, StorageCreateDto storageCreateDto, Authentication authentication);
    StorageDetailDto editStorage(Long storageId, StorageEditDto storageEditDto, Authentication authentication);

    StorageComplexDto getComplexStorage(Long storageId, Authentication authentication);

    List<StorageComplexDto> getUserStorages(Authentication authentication);

    StorageStashDetailDto getStorageDetailsWithStash(Long storageId, Authentication authentication);
    StorageDetailDto getStorage(Long storageId, Authentication authentication);

    List<Storage> getRawUserStorages(Authentication authentication);

    Storage getRawUserStorage(Authentication authentication, Long storageId);

    List<StorageStashDetailDto> getStoragesInStashByStorageId(Long storageId, Authentication authentication);
}
