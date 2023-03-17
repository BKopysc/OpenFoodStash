import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {MatMenuModule} from '@angular/material/menu';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterLink, RouterLinkWithHref} from '@angular/router';
import {MatListModule} from '@angular/material/list';
import { MenubarComponent } from './components/menubar/menubar.component';
import {MatSelectModule} from '@angular/material/select';
import { BackTopButtonComponent } from './components/back-top-button/back-top-button.component';
import { ErrorFormDivComponent } from './components/error-form-div/error-form-div.component';
import { FoodTableComponent } from './components/food-table/food-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import { TestTableComponent } from './components/test-table/test-table.component';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EditFoodModalComponent } from './components/modals/edit-food-modal/edit-food-modal.component';
import { MoveToTrashFoodModalComponent } from './components/modals/move-to-trash-food-modal/move-to-trash-food-modal.component';
import { EatFoodModalComponent } from './components/modals/eat-food-modal/eat-food-modal.component';
import { DetailsFoodModalComponent } from './components/modals/details-food-modal/details-food-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import { ThrowAllOutdatedFoodModalComponent } from './components/modals/throw-all-outdated-food-modal/throw-all-outdated-food-modal.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FoodHistoryTableComponent } from './components/food-history-table/food-history-table.component';
import { RecoverFoodModalComponent } from './components/modals/recover-food-modal/recover-food-modal.component';
import { StatisticsTabComponent } from './components/statistics-tab/statistics-tab.component';
import {MatRadioModule} from '@angular/material/radio';
import { StatisticChartTileComponent } from './components/statistics-tab/charts/statistic-chart-tile/statistic-chart-tile.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {NgChartsModule} from 'ng2-charts';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { StatisticOverallTileComponent } from './components/statistics-tab/overall/statistic-overall-tile/statistic-overall-tile.component';
import { LastStatisticsListModalComponent } from './components/statistics-tab/modal/last-statistics-list-modal/last-statistics-list-modal.component';
import { MessageCardComponent } from './components/message-card/message-card.component';
import { ShareStashModalComponent } from './components/modals/share-stash-modal/share-stash-modal.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ShareInfoStashModalComponent } from './components/modals/share-info-stash-modal/share-info-stash-modal.component';
import { AboutQuickOffersComponent } from './components/about-quick-offers/about-quick-offers.component';
import { LoadingOverallTileComponent } from './components/loading-overall-tile/loading-overall-tile.component';
import { MobileFoodTableTileComponent } from './components/mobile-food-table-tile/mobile-food-table-tile.component';
import {MobileFoodTableSortComponent} from './components/mobile-food-table-sort/mobile-food-table-sort.component';



@NgModule({
    declarations: [
        NavbarComponent,
        MenubarComponent,
        BackTopButtonComponent,
        ErrorFormDivComponent,
        FoodTableComponent,
        TestTableComponent,
        EditFoodModalComponent,
        MoveToTrashFoodModalComponent,
        EatFoodModalComponent,
        DetailsFoodModalComponent,
        ThrowAllOutdatedFoodModalComponent,
        FoodHistoryTableComponent,
        RecoverFoodModalComponent,
        StatisticsTabComponent,
        StatisticChartTileComponent,
        StatisticOverallTileComponent,
        LastStatisticsListModalComponent,
        MessageCardComponent,
        ShareStashModalComponent,
        ShareInfoStashModalComponent,
        AboutQuickOffersComponent,
        LoadingOverallTileComponent,
        MobileFoodTableTileComponent,
        MobileFoodTableSortComponent
    ],
    exports: [
        NavbarComponent,
        MenubarComponent,
        BackTopButtonComponent,
        ErrorFormDivComponent,
        FoodTableComponent,
        TestTableComponent,
        FoodHistoryTableComponent,
        StatisticsTabComponent,
        MessageCardComponent,
        AboutQuickOffersComponent,
        StatisticOverallTileComponent,
        LoadingOverallTileComponent
    ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    MatMenuModule,
    FlexModule,
    FlexLayoutModule,
    MatSidenavModule,
    RouterLinkWithHref,
    MatListModule,
    MatSelectModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatStepperModule,
    MtxButtonModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    MatRadioModule,
    MatGridListModule,
    NgChartsModule,
    MatCardModule,
    MatButtonToggleModule,
    MatTabsModule,
  ]
})
export class SharedModule { }
