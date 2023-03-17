package com.bkopysc.foodstash.controller;

import com.bkopysc.foodstash.dto.stashes.StashCreateDto;
import com.bkopysc.foodstash.dto.storages.*;
import com.bkopysc.foodstash.service.storages.StoragesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/storages")
@PreAuthorize("hasRole('USER')")
public class StorageController {

    private final StoragesService storagesService;

    @PostMapping("/stash/{id}")
    public ResponseEntity<StorageComplexDto> addStorage(@PathVariable Long id, @Valid @RequestBody StorageCreateDto storageCreateDto,
                                                       Authentication authentication){
        return ResponseEntity.ok(storagesService.addStorage(id, storageCreateDto, authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StorageDetailDto> getStorage(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(storagesService.getStorage(id, authentication));
    }

    @GetMapping("/complex/{id}")
    public ResponseEntity<StorageComplexDto> getComplexStorage(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(storagesService.getComplexStorage(id, authentication));
    }

    @GetMapping("/other-in-stash/{storageId}")
    public ResponseEntity<List<StorageStashDetailDto>> getOtherStoragesInStash(@PathVariable Long storageId,
                                                                    Authentication authentication){
        return ResponseEntity.ok(storagesService.getStoragesInStashByStorageId(storageId, authentication));
    }

    @GetMapping("/my")
    public ResponseEntity<List<StorageComplexDto>> getUserStorages(Authentication authentication){
        return ResponseEntity.ok(storagesService.getUserStorages(authentication));
    }

    @GetMapping("/with-stashname/{id}")
    public ResponseEntity<StorageStashDetailDto> getUserStorageWithStashName(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(storagesService.getStorageDetailsWithStash(id, authentication));
    }


    @PutMapping("/{id}")
    public ResponseEntity<StorageDetailDto> editStorage(@PathVariable Long id, @Valid @RequestBody StorageEditDto storageEditDto,
                                                        Authentication authentication){
        return ResponseEntity.ok(storagesService.editStorage(id, storageEditDto, authentication));
    }


}
