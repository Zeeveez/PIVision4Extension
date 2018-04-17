/**
Copyright 2018 Servelec Controls

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
import { OurSymbolComponent } from './ourSymbol.component';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing'
import { Component, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { testOutputPath } from '../../test-utils';

describe('Component: OurSymbolComponent', function () {

  @Component({
    selector: 'test-app',
    template: `
      <example #ourSymbolComponent
        [data]="data"
        [pathPrefix]="pathPrefix"
      ></example>
    `
  })
  class TestHostComponent {
    @ViewChild('ourSymbolComponent', { read: OurSymbolComponent })
    target: OurSymbolComponent;

    data: any;
    pathPrefix: string;
  }

  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let component: OurSymbolComponent;

  beforeEach(async(() => {

  }));

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports:      [ ],
      declarations: [ TestHostComponent, OurSymbolComponent ],
      providers:    [ ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(OurSymbolComponent, {
      set: {
        templateUrl: testOutputPath + 'ourSymbol/ourSymbol.component.html',
        styleUrls:  [testOutputPath + 'ourSymbol/ourSymbol.component.css']
      }
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      component = host.target;
      fixture.detectChanges();
    });
  });

   // very basic unit test example
   it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
