import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgLibrary, SymbolType, SymbolInputType, ConfigPropType } from './framework';
import { LibModuleNgFactory } from './module.ngfactory';

import { ExampleComponent } from './example/example.component';
import { OurSymbolComponent } from './ourSymbol/ourSymbol.component';

@NgModule({
  declarations: [ ExampleComponent, OurSymbolComponent ],
  imports: [ CommonModule ] ,
  exports: [ ExampleComponent, OurSymbolComponent ],
  entryComponents: [ ExampleComponent, OurSymbolComponent ]
})
export class LibModule { }

export class ExtensionLibrary extends NgLibrary {
  module = LibModule;
  moduleFactory = LibModuleNgFactory;
  symbols: SymbolType[] = [
    {
      name: 'example-symbol',
      displayName: 'Example Symbol',
      dataParams: { shape: 'single' },
      thumbnail: '^/assets/images/example.svg',
      compCtor: ExampleComponent,
      inputs: [
        SymbolInputType.Data,
        SymbolInputType.PathPrefix
      ],
      generalConfig: [
        {
          name: 'Example Options',
          isExpanded: true,
          configProps: [
            { propName: 'bkColor', displayName: 'Background color', configType: ConfigPropType.Color, defaultVal: 'white' },
            { propName: 'fgColor', displayName: 'Color', configType: ConfigPropType.Color, defaultVal: 'black' }
          ]
        }
      ],
      layoutWidth: 200,
      layoutHeight: 100
    },
    {
      name: 'our-symbol',
      displayName: 'Our Symbol',
      dataParams: { shape: 'trend', dataMode: 'recordedvalues' },
      thumbnail: '^/assets/images/ourSymbol.svg',
      compCtor: OurSymbolComponent,
      inputs: [
        SymbolInputType.Data,
        SymbolInputType.PathPrefix
      ],
      layoutWidth: 200,
      layoutHeight: 200
    }
  ];
}
