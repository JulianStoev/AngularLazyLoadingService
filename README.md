# Angular Lazy Loading Service

Big part of Angular optimization is the so called lazy loading. To take it further we can **dynamically load components on demand**. That's what this service do, it loads a component only if you need it so there is no need of dependency injection ahead of time.

### Prerequisite

Angular 9+ with Ivy

### Example usage

In the lazy load service, describe the path to the components you wish to load, both in the interface and in the getImport method.

Let's assume you imported the service as lazyLoad

TS
```
this.lazyLoad.load({
    item: 'styles',
    data: {
        someName: 'someVal'
    },
    callback: () => {

    }
});
```
- **item**: the item you wish to dynamically include as described in your lazyLoad service interface **required**
- **data**: pass some data to the dynamically included component
- **callback**: the component is loaded, do something


HTML
```
<ng-template 
    [ngComponentOutletInjector]="lazyLoad.injectors.styles" 
    [ngComponentOutlet]="lazyLoad.promises.styles | async" 
    *ngIf="lazyLoad.promises.styles">
</ng-template>
```

styles.component.ts
```
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-styles',
    templateUrl: './styles.component.html',
    styleUrls: ['./styles.component.scss']
})
export class StylesComponent {
    constructor(
        @Inject('initData') private initData
    ) {}
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [StylesComponent],
    imports: [
        CommonModule
    ],
    exports: [StylesComponent]
})
class StylesModule { }
``` 

- Note you have the module inside the component and it has no export!
- The initData will hold any data you may have passed with the load method.
- If the component has already been lazy loaded, each time you lazy load it again, if there is data passed, it will reload it and go through the ngOnInit where you can get the new data.
- Note that some module imports may not work with dynamically loaded components, for example Material CDK Overlay that is needed for MatTooltip and MatSelect. You need to provide it in your app.module in order to work in the dynamically included components.

If you wish to remove the lazy loaded component you can use **lazyLoad.remove(name)**
