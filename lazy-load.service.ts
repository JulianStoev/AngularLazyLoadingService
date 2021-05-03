import { Injectable, Injector } from '@angular/core';

type itemsInterface = 'styles' | 'scripts';

type callbackInterface = () => void;

interface lazyInterface {
  item: itemsInterface;
  callback?: callbackInterface;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class LazyLoadService {

  constructor(
    private injector: Injector
  ) { }

  public injectors = {} as any;
  public promises = {} as any;

  public remove(name: itemsInterface): void {
    delete this.injectors[name];
    delete this.promises[name];
  }

  public load(data: lazyInterface): void {
    // load the injector if not already loaded or if there is new data to be passed
    if (!this.injectors[data.item] || data && data.data) {
      this.injectors[data.item] = Injector.create({
        providers: [{
          provide: 'initData',
          useValue: (data && data.data ? data.data : '')
        }],
        parent: this.injector
      });
    }

    // load the component if not already loaded
    if (!this.promises[data.item]) {
      setTimeout(() => { // prevent expression changed error...
        this.promises[data.item] = this.getImport(data.item).then(module => {
          let name;
          Object.keys(module).forEach(k => {
            if (module[k].hasOwnProperty('ɵcmp')) {
              name = module[k];
              return;
            }
          });
          // just in case send to the back of the event loop to be sure we have the promise before the callback
          setTimeout(() => {
            this.callBack(data.callback);
          });
          return name;
        });
      });
      return;
    }

    this.callBack(data.callback);    
  }

  private callBack(callback: callbackInterface): void {
    if (callback) {
      callback();
    }
  }

  private getImport(component: itemsInterface): Promise<any> {
    switch(component) {
      case 'styles':
        return import('path/to/styles/styles.component');

      case 'scripts':
        return import('path/to/scripts/scripts.component');
    }
  }

}
