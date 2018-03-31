/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
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
