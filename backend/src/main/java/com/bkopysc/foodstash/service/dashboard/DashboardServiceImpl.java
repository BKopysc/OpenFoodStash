package com.bkopysc.foodstash.service.dashboard;

import com.bkopysc.foodstash.domain.Alert;
import com.bkopysc.foodstash.domain.Stash;
import com.bkopysc.foodstash.domain.Storage;
import com.bkopysc.foodstash.domain.User;
import com.bkopysc.foodstash.dto.dashboard.DashboardSimpleDto;
import com.bkopysc.foodstash.repository.AlertRepository;
import com.bkopysc.foodstash.repository.FoodRepository;
import com.bkopysc.foodstash.repository.StashRepository;
import com.bkopysc.foodstash.repository.StorageRepository;
import com.bkopysc.foodstash.service.users.UserService;
import com.bkopysc.foodstash.service.users.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Set;

@RequiredArgsConstructor
@Service
public class DashboardServiceImpl implements DashboardService{

    private final UserService userService;

    private final StashRepository stashRepository;
    private final StorageRepository storageRepository;
    private final AlertRepository alertRepository;

    private final FoodRepository foodRepository;

    @Override
    public DashboardSimpleDto getDashboardSimple(Authentication authentication) {
        User user = this.userService.getCurrentUser(authentication);
        Set<Stash> stashes = user.getUserStashes();

        int numOfStashes = stashes.size();
        int numOfStorages = this.storageRepository.countAllByStashIn(stashes);
        long numOfAlerts = 0;
        long numOfActiveFood = 0;

        for(Alert alert : this.alertRepository.getAllByStorage_StashIn(stashes)){
         numOfAlerts += alert.getNumberOfAlerts();
        }

        for(Stash stash : stashes){
            for(Storage storage : stash.getStorages()){
                numOfActiveFood += foodRepository.countActiveByStorage(storage.getId());
            }
        }

        return new DashboardSimpleDto().builder()
                .name(user.getProfile().getName())
                .numOfActiveFood(numOfActiveFood)
                .numOfStorages(numOfStorages)
                .numOfStashes(numOfStashes)
                .numOfAlerts(numOfAlerts)
                .build();

    }
}
