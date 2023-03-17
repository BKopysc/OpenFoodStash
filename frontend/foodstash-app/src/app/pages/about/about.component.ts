import { Component, OnInit } from '@angular/core';
import {map, Subscription} from 'rxjs';
import {TestPlayService} from '../../services/test/test-play.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {


  optionsList: string[] = [];
  faqArray: Array<{question: string, data: string[]}> = [];
  faqExpanded: Set<number> = new Set<number>();
  optionsExpanded: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
    //this.username = this.authService.getUsername()
    this.createFastFaqs(1,2);
    this.pushOptions();
  }

  pushOptions(){
    const name = 'about.optionsList.options';

    for(let i = 1; i < 12; i++){
      this.optionsList.push(name+i.toString());
    }
  }


  createFastFaqs(index: number, endAnswerNum: number) {
    const question = 'about.faqList.faq' + index.toString();
    const answers: string[] = [];

    for (let i = 1; i <= endAnswerNum; i++) {
      answers.push('about.faqList.faqAnswer' + index.toString() + '_' + i.toString());
    }

    this.faqArray.push({question: question, data: answers});
  }

  onFaqRowClick(id: number) {
    if(this.faqExpanded.has(id)){
      this.faqExpanded.delete(id);
    } else {
      this.faqExpanded.add(id);
    }
  }

  onOptionsRowClick() {
    this.optionsExpanded = !this.optionsExpanded;
  }
}
