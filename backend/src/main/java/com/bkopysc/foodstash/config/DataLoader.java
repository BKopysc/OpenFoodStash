package com.bkopysc.foodstash.config;

import com.bkopysc.foodstash.domain.ERole;
import com.bkopysc.foodstash.domain.Food;
import com.bkopysc.foodstash.domain.FoodCategory;
import com.bkopysc.foodstash.domain.Role;
import com.bkopysc.foodstash.repository.FoodCategoryRepository;
import com.bkopysc.foodstash.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
public class DataLoader implements ApplicationRunner {
    private FoodCategoryRepository foodCategoryRepository;
    private RoleRepository roleRepository;

    @Autowired
    public DataLoader(FoodCategoryRepository foodCategoryRepository, RoleRepository roleRepository){
        this.foodCategoryRepository = foodCategoryRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        List<FoodCategory> foodCategoryList = foodCategoryRepository.findAll();
        List<FoodCategory> foodCategoryToAddList = new ArrayList<>();

        defaultCategoriesData()
                .forEach(foodCategory -> {
                    boolean noneMatchRes = foodCategoryList.stream()
                            .noneMatch(foodCategory1 -> foodCategory1.getName().equals(foodCategory.getName()));
                    if(noneMatchRes){
                        foodCategoryToAddList.add(foodCategory);
                    }
                });

        foodCategoryRepository.saveAll(foodCategoryToAddList);
        loadRoles();
    }

    private void loadRoles(){
        List<Role> roleSet = roleRepository.findAll();
        List<Role> rolesToSave = new ArrayList<>();
        defualtRolesData()
                .forEach(role -> {
                    if(roleSet.stream().noneMatch(role1 -> role1.getName().equals(role.getName()))){
                        rolesToSave.add(role);
                    }
                });

        roleRepository.saveAll(rolesToSave);
    }

    private List<Role> defualtRolesData(){
        return Arrays.asList(
                new Role(ERole.ROLE_USER),
                new Role(ERole.ROLE_ADMIN),
                new Role(ERole.ROLE_MODERATOR)
        );
    }

    private List<FoodCategory> defaultCategoriesData(){

        return Arrays.asList(
                new FoodCategory("DRINK", false),
                new FoodCategory("SAUCE", false),
                new FoodCategory("MEAT", true),
                new FoodCategory("BREAD", false),
                new FoodCategory("DAIRY", true),
                new FoodCategory("VEGETABLE", false),
                new FoodCategory("FRUIT", false),
                new FoodCategory("MEAL", false),
                new FoodCategory("SWEETS", false),
                new FoodCategory("OTHER", false)
        );
    }
}
