package com.bkopysc.foodstash.service.foods;

import com.bkopysc.foodstash.domain.*;
import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.foods.*;
import com.bkopysc.foodstash.dto.params.EFoodStatusParam;
import com.bkopysc.foodstash.repository.FoodCategoryRepository;
import com.bkopysc.foodstash.repository.FoodRepository;
import com.bkopysc.foodstash.repository.StashRepository;
import com.bkopysc.foodstash.repository.StorageRepository;
import com.bkopysc.foodstash.service.alerts.AlertsServiceImpl;
import com.bkopysc.foodstash.service.foodCategories.FoodCategoriesService;
import com.bkopysc.foodstash.service.storages.StoragesServiceImpl;
import com.bkopysc.foodstash.service.users.UserServiceImpl;
import com.bkopysc.foodstash.utils.calcs.FoodAlertCalcUtil;
import com.bkopysc.foodstash.utils.calcs.FoodStatusCalcUtil;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import com.querydsl.core.BooleanBuilder;
import lombok.RequiredArgsConstructor;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class FoodsServiceImpl implements FoodsService {

    private final EntityManager entityManager;
    private final UserServiceImpl userService;
    private final StoragesServiceImpl storagesService;
    private final StorageRepository storageRepository;
    private final StashRepository stashRepository;
    private final FoodRepository foodRepository;

    private final AlertsServiceImpl alertsService;
    private final FoodCategoriesService foodCategoriesService;

    private final FoodCategoryRepository foodCategoryRepository;
    private final ModelMapper modelMapper;

    private static final FoodStatusCalcUtil foodUtil = new FoodStatusCalcUtil();
    private static final FoodAlertCalcUtil foodAlertCalcUtil = new FoodAlertCalcUtil();

    private final String STORAGES_BAD_IDS = "storages.error.badIds";
    private final String STORAGES_NOT_AVAILABLE = "storages.error.notAvailable";
    private final String FOOD_CATEGORY_NOT_FOUND = "foodCategory.error.notFound";
    private final String USER_NOT_ALLOWED = "user.auth.error.notAllowed";
    private final String FOOD_NOT_FOUND = "food.error.notFound";
    private final String STORAGE_NOT_EXIST = "storages.error.notExist";
    private final String STASH_NOT_EXIST = "stashes.error.notExist";


    @Override
    public Page<FoodDetailsDto> getFoodDetailsListByStorage(Long storageId, Authentication authentication, Pageable pageable,
                                                            List<String> filterData, List<Long> foodCategoryIds,
                                                            FoodRequestParamDto foodRequestParamDto) {

        User user = userService.getCurrentUser(authentication);
        Storage storage = getUserStorageById(storageId, user);

        BooleanBuilder booleanBuilder = booleanBuilderForFoodDetails(filterData, List.of(storageId), foodCategoryIds, foodRequestParamDto);
        if (booleanBuilder == null) {
            throw new BadRequestException(STORAGES_BAD_IDS);
        }

        Session session = entityManager.unwrap(Session.class);
        Filter filter = session.enableFilter("deletedFoodFilter");
        filter.setParameter("isDeleted", foodRequestParamDto.isDeleted());

        Page<Food> foodPage = foodRepository.findAll(booleanBuilder, pageable);

        session.disableFilter("deletedFoodFilter");

        return new PageImpl<>(mapFoodToFoodDetails(foodPage.getContent()), pageable, foodPage.getTotalElements());

    }

    @Override
    public Page<FoodDetailsDto> getFoodDetailsListByStash(Long stashId, Authentication authentication, Pageable pageable,
                                                          List<String> filterData, List<Long> foodCategoryIds,
                                                          FoodRequestParamDto foodRequestParamDto) {

        User user = userService.getCurrentUser(authentication);
        Stash stash = getUserStash(stashId, user);
        List<Long> storageIds = stash.getStorages().stream().map(Storage::getId).toList();

        BooleanBuilder booleanBuilder = booleanBuilderForFoodDetails(filterData, storageIds, foodCategoryIds, foodRequestParamDto);
        if (booleanBuilder == null) {
            throw new BadRequestException(STORAGES_BAD_IDS);
        }

        Page<Food> foodPage = foodRepository.findAll(booleanBuilder, pageable);

        return new PageImpl<>(mapFoodToFoodDetails(foodPage.getContent()), pageable, foodPage.getTotalElements());
    }

    private List<FoodDetailsDto> mapFoodToFoodDetails(List<Food> foodList) {

        return foodList
                .stream()
                .map(food -> {
                    FoodDetailsDto mappedDto = modelMapper.map(food, FoodDetailsDto.class);
                    mappedDto.setStatus(foodUtil.calcStatus(mappedDto));
                    return mappedDto;
                }).toList();
    }

    private BooleanBuilder booleanBuilderForFoodDetails(List<String> filterData, List<Long> storageIds,
                                                        List<Long> foodCategoryIds, FoodRequestParamDto foodRequestParamDto) {
        QFood qFood = QFood.food;
        QStorage qStorage = QStorage.storage;

        BooleanBuilder booleanBuilder = new BooleanBuilder();

        if (!storageIds.isEmpty()) {
            for (Long storageId : storageIds) {
                booleanBuilder.and(qFood.storage.id.eq(storageId));
            }
        } else {
            return null;
        }

        //Filter by foodCategoryIds @Param
        if (foodCategoryIds != null) {
            booleanBuilder.and(qFood.foodCategory.id.in(foodCategoryIds));
//            for(Long foodCategoryId : foodCategoryIds){
//                booleanBuilder.or(qFood.foodCategory.id.eq(foodCategoryId));
//            }
        }

        //Filter by filterData @Param
        if (filterData != null) {
//            booleanBuilder.and(qFood.name.(filterData, CaseHandling));
            BooleanBuilder subBoolean = new BooleanBuilder();
            for (String filter : filterData) {
                subBoolean.or(qFood.name.containsIgnoreCase(filter));
            }
            booleanBuilder.and(subBoolean);

//                //booleanBuilder.or(qFood.foodCategory.name.containsIgnoreCase(filter));
//                booleanBuilder.or(qFood.name.containsIgnoreCase(filter));
//            }
        }

        //Filter by filterStatus @Param

        if(foodRequestParamDto.getFoodStatus() != EFoodStatusParam.ANY){
//            Calendar calendarActive = Calendar.getInstance();
//            calendarActive.add(Calendar.HOUR_OF_DAY, 23);
//            calendarActive.add(Calendar.MINUTE, 59);
//            calendarActive.add(Calendar.SECOND, 59);


//            LocalDateTime localDateTime = LocalDateTime.now();
//            localDateTime = localDateTime.withHour(23).withMinute(59).withSecond(59);


            switch (foodRequestParamDto.getFoodStatus()) {
                case OUTDATED -> booleanBuilder.and(qFood.expirationDate.lt(new Date()));
                case ACTIVE -> booleanBuilder.and(qFood.expirationDate.gt(new Date()));
                case ALERTED -> booleanBuilder.and(qFood.isAlerted.isTrue());
            }
        }

        if(foodRequestParamDto.getIsOpen() != null){
            booleanBuilder.and(qFood.isOpen.eq(foodRequestParamDto.getIsOpen()));
        }

        booleanBuilder.and(qFood.inTrash.eq(foodRequestParamDto.isInTrash()));
        booleanBuilder.and(qFood.deleted.eq(foodRequestParamDto.isDeleted())); //TODO przetestowac deleted
        booleanBuilder.and(qFood.isEaten.eq(foodRequestParamDto.isEaten()));

        return booleanBuilder;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SimpleResponse addFoodList(List<FoodCreateDto> foodCreateDtoList, Authentication authentication) {
        List<Storage> storages = storagesService.getRawUserStorages(authentication);
        List<FoodCategory> categories = foodCategoryRepository.findAll();

        Map<Long, FoodCategory> foodCategoryMap = categories.stream()
                .collect(Collectors.toMap(c -> c.getId(), c -> c));

        Map<Long, Storage> storagesMap = storages.stream()
                .collect(Collectors.toMap(s -> s.getId(), s -> s));

        Map<Storage, Set<Food>> foodMap = new HashMap<>();

        for (FoodCreateDto foodCreateDto : foodCreateDtoList) {

            if (!storagesMap.containsKey(foodCreateDto.getStorageId())) {
                throw new BadRequestException(STORAGES_NOT_AVAILABLE);
            }

            if (!foodCategoryMap.containsKey(foodCreateDto.getCategoryId())) {
                throw new BadRequestException(FOOD_CATEGORY_NOT_FOUND);
            }

            Food food = new Food();
            food.setName(foodCreateDto.getName());
            food.setUnitType(foodCreateDto.getUnitType());
            food.setInitialUnitValue(foodCreateDto.getInitialUnitValue());
            food.setUnitValue(food.getInitialUnitValue());
            food.setEaten(foodCreateDto.isEaten());
            food.setOpen(foodCreateDto.isOpen());
            //food.setUneatable(foodCreateDto.isUneatable());
            food.setFreshScore(foodCreateDto.getFreshScore());
            food.setAddedDate(new Date());

            Storage selectedStorage = storagesMap.get(foodCreateDto.getStorageId());
            FoodCategory foodCategory = foodCategoryMap.get(foodCreateDto.getCategoryId());

            food.setStorage(selectedStorage);
            food.setFoodCategory(foodCategory);

            if (foodCreateDto.getExpirationDate() == null) {
                food.setExpirationDate(foodUtil.predictDate(foodCreateDto.getFreshScore(), food.isOpen(),
                        food.getFoodCategory().getName(), selectedStorage.getStorageType()));
            } else {
                food.setExpirationDate(foodCreateDto.getExpirationDate());
            }

            //set alert for food
            food.setAlerted(foodAlertCalcUtil.calcIfAlert(food));

            if (!foodMap.containsKey(selectedStorage)) {
                foodMap.put(selectedStorage, new HashSet<>());
            }
            foodMap.get(selectedStorage).add(food);
        }

        foodMap.forEach((storage, foods) -> {
            storage.setFoodSet(foods);

            //force recalculate
            storage.setAlert(alertsService.recalculateForNewFood(foods, storage));
        });

        List<Food> foodListToAdd = new ArrayList<>();
        foodMap.values().forEach(foodListToAdd::addAll);

        foodRepository.saveAll(foodListToAdd);
        storageRepository.saveAll(foodMap.keySet());

        return new SimpleResponse("Food added");

    }

    @Override
    public FoodDetailsDto consumeFood(Long id, FoodConsumeDto foodConsumeDto, Authentication authentication) {

        User user = userService.getCurrentUser(authentication);

        Food food = validateAndGetFoodById(id, user);

        if (food == null) {
            return null;
        }

        if (foodConsumeDto.getConsumeAmount() > food.getUnitValue()) {
            food.setUnitValue(0.0);
        } else if (foodConsumeDto.getConsumeAmount() >= 0) {
            double rounded = Math.round(foodConsumeDto.getConsumeAmount() * 100.0) / 100.0;
            food.setUnitValue(rounded);
            food.setOpen(true);
        }

        if (food.getUnitValue() == 0) {
            food.setEaten(true);
            alertsService.recalculateForMovedFood(Set.of(food));
            //food.setAlerted(false);
            food.setProcessedDate(new Date());
        }

        foodRepository.save(food);

        return modelMapper.map(food, FoodDetailsDto.class);
    }

    @Override
    public FoodDetailsDto editFood(Long id, FoodEditDto foodEditDto, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        Food food = validateAndGetFoodById(id, user);

        if (food == null) {
            return null;
        }

        food.setName(foodEditDto.getName());
        Storage currentStorage = food.getStorage();
        Storage nextStorage = storagesService.getRawUserStorage(authentication, foodEditDto.getStorageId());

        if(!Objects.equals(nextStorage.getId(), currentStorage.getId())){
            if(food.isAlerted()){
                long currentAlertCount = currentStorage.getAlert().getNumberOfAlerts();
                long nextAlertCount = nextStorage.getAlert().getNumberOfAlerts();
                currentStorage.getAlert().setNumberOfAlerts(currentAlertCount-1);
                nextStorage.getAlert().setNumberOfAlerts(nextAlertCount-1);
            }
        }

        food.setStorage(nextStorage);

        FoodCategory foodCategory = foodCategoriesService.getRawFoodCategory(foodEditDto.getCategoryId());
        food.setFoodCategory(foodCategory);

        food.setExpirationDate(foodEditDto.getExpirationDate()); //TODO check expiration date for edit - set alerted
        food.setOpen(foodEditDto.isOpen());
        food.setUnitType(foodEditDto.getUnitType());

        if(foodEditDto.getUnitValue() > 0){
            food.setUnitValue(Math.round(foodEditDto.getUnitValue() * 100.0)/100.0);
        } else {
            food.setUnitValue(0.0);
        }

        if(foodEditDto.getInitialUnitValue() > 0){
            food.setInitialUnitValue(Math.round(foodEditDto.getInitialUnitValue() * 100.0)/100.0);
        } else {
            food.setInitialUnitValue(0.0);
        }

        boolean isAlertedBefore = food.isAlerted();
        food.setAlerted(foodAlertCalcUtil.calcIfAlert(food));
        alertsService.recalculateForEditFood(food,isAlertedBefore);

        if (food.getUnitValue() == 0.0) {
            food.setEaten(true);
            alertsService.recalculateForMovedFood(Set.of(food));
            //food.setAlerted(false);
            food.setProcessedDate(new Date());
        }

        foodRepository.save(food);

        if(!Objects.equals(currentStorage.getId(), nextStorage.getId())) {
            storageRepository.save(currentStorage);
            storageRepository.save(nextStorage);
        }

        return mapFoodToFoodDetails(List.of(food)).get(0);
    }

    @Override
    public SimpleResponse recoverFood(Long id, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        Session session = entityManager.unwrap(Session.class);
        Filter filter = session.enableFilter("deletedFoodFilter");
        filter.setParameter("isDeleted", true);

        Food food = validateAndGetFoodById(id, user);
        if(food == null){
            return null;
        }

        if(food.isDeleted()){
            food.setDeleted(false);
        } else if(food.isInTrash()){
            food.setInTrash(false);
        } else if(food.isEaten()){
            food.setEaten(false);
            food.setUnitValue(food.getInitialUnitValue());
        }

        alertsService.recalculateForRecoverFood(Set.of(food));
        food.setProcessedDate(null);
        foodRepository.save(food);

        session.disableFilter("deletedFoodFilter");

        return new SimpleResponse("Recovered:", id);
    }

    @Override
    public SimpleResponse moveFoodToTrash(Long id, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Food food = validateAndGetFoodById(id, user);

        if (food == null) {
            return null;
        }

        food.setInTrash(true);
        alertsService.recalculateForMovedFood(Set.of(food));
        //food.setAlerted(false);
        food.setProcessedDate(new Date());

        foodRepository.save(food);

        return new SimpleResponse("Ok", food.getId());
    }

    @Override
    public SimpleResponse deleteFood(Long id, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Food food = validateAndGetFoodById(id, user);

        if (food == null) {
            return null;
        }

        alertsService.recalculateForMovedFood(Set.of(food));
        //food.setAlerted(false);
        food.setProcessedDate(new Date());

        foodRepository.save(food);
        foodRepository.delete(food);

        return new SimpleResponse("Ok");
    }

    @Override
    public SimpleResponse throwAllOutdatedFoodsFromStorages(List<Long> storageIds, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        QFood qFood = QFood.food;
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        booleanBuilder.and(qFood.storage.id.in(storageIds));
        booleanBuilder.and(qFood.expirationDate.gt(new Date()));

        Set<Long> storageSetIds = new HashSet<>();

        for (Long storageId : storageIds) {
            storageSetIds.add(getUserStorageById(storageId, user).getId());
        }

        List<Food> foodList = foodRepository.findOutdatedFoodsByStorages(storageSetIds);

        foodList.forEach(food -> food.setInTrash(true));

        foodRepository.saveAll(foodList);

        return new SimpleResponse("Ok");
    }

    private Food validateAndGetFoodById(Long foodId, User user) {
        Optional<Food> _food = this.foodRepository.findById(foodId);
        if (_food.isEmpty()) {
            throw new BadRequestException(FOOD_NOT_FOUND);
        }
        Food food = _food.get();
        if (!checkUserStorageByFood(food, user)) {
            return null;
        }

        return food;
    }

    //    private long executeAlertWhenAdded(Storage storage){
//        AlertDetailsDto alertDetailsDto = alertsService.executeAndGetAlert(storage.getId(),true);
//        return alertDetailsDto.getNumberOfAlerts();
//    }
    private Storage getUserStorageById(Long storageId, User user) {
        Storage storage = storageRepository.findById(storageId).orElseThrow(() -> new BadRequestException(STORAGE_NOT_EXIST));

        Stash stash = stashRepository.findByStorages(storage);
        if (stash.getUsedByUsers().stream().noneMatch(user1 -> user1.getId().equals(user.getId()))) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        return storage;
    }


    private boolean checkUserStorageByFood(Food food, User user) {

        Stash stash = stashRepository.findByStorages(food.getStorage());
        if (stash.getUsedByUsers().stream().noneMatch(user1 -> user1.getId().equals(user.getId()))) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        return true;
    }


    private Stash getUserStash(Long stashId, User user) {
        Stash stash = stashRepository.findById(stashId).orElseThrow(() -> new BadRequestException(STASH_NOT_EXIST));
        if (!stash.getUsedByUsers().stream().anyMatch(user1 -> user1.getId() == user.getId())) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }
        return stash;
    }
}
