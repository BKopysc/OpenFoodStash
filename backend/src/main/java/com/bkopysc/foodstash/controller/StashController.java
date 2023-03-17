package com.bkopysc.foodstash.controller;

import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.stashes.*;
import com.bkopysc.foodstash.service.stashes.StashesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/stashes")
@PreAuthorize("hasRole('USER')")
public class StashController {

    private final StashesService stashesService;

    @PostMapping("")
    public ResponseEntity<SimpleResponse> saveNewStash(@Valid @RequestBody StashCreateDto stashCreateDto, Authentication authentication) {
        return ResponseEntity.ok().body(stashesService.createStash(stashCreateDto, authentication));
    }

    @GetMapping("/my")
    public ResponseEntity<List<StashDetailsDto>> getStashListByCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(stashesService.getStashListByCurrentUser(authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StashDetailsDto> getStashDetails(@PathVariable Long id, Authentication authentication){
        return ResponseEntity.ok(stashesService.getStash(id, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StashDetailsDto> editStash(@PathVariable Long id, @Valid @RequestBody StashEditDto stashEditDto,
                                                     Authentication authentication) {
        return ResponseEntity.ok(stashesService.editStash(id, stashEditDto, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SimpleResponse> deleteStash(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(stashesService.deleteStash(id, authentication));
    }

    @PostMapping("/share-request/{stashId}")
    public ResponseEntity<SimpleResponse> stashShareRequest(@PathVariable Long stashId, @Valid @RequestBody StashShareDto stashShareDto,
                                                       Authentication authentication){
        return ResponseEntity.ok(stashesService.createShareStashToken(stashId, stashShareDto, authentication));
    }

    @GetMapping("/share-request/{stashId}/pending")
    public ResponseEntity<List<StashShareDetailDto>> getPendingStashShareRequests(@PathVariable Long stashId, Authentication authentication){
        return ResponseEntity.ok(stashesService.getPendingShareRequests(stashId, authentication));
    }

    @GetMapping("/{stashId}/collaborators")
    public ResponseEntity<List<StashCollaboratorDto>> getStashCollaborators(@PathVariable Long stashId, Authentication authentication){
        return ResponseEntity.ok(stashesService.getStashCollaborators(stashId, authentication));
    }


    @PutMapping("/share-request/{stashId}")
    public ResponseEntity<SimpleResponse> cancelShareRequest(@PathVariable Long stashId, @Valid @RequestBody StashShareDto stashShareDto,
                                                             Authentication authentication){
        return ResponseEntity.ok(stashesService.cancelPendingShareRequest(stashId, stashShareDto, authentication));
    }

    @PostMapping("/accept-invitation/{invitationToken}")
    public ResponseEntity<SimpleResponse> acceptStashInvitation(@PathVariable String invitationToken, Authentication authentication){
        return ResponseEntity.ok(stashesService.executeStashShare(invitationToken, authentication));
    }

//    @PostMapping("/accept-share/{tokenValue}")
//    public ResponseEntity<SimpleResponse> stashSharing(@PathVariable String tokenValue){
//        return ResponseEntity.ok(stashesService.shareStash(id));
//    }

}
