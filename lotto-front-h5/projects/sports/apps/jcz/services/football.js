import { Observable } from 'rxjs/Observable';
import store from '../store';

let currentData;

export function filter(id) {
  return Observable.create(observer => {
    store.subscribe(function() {
      let preData = currentData;
      currentData = query(id);
      if (JSON.stringify(preData) !== JSON.stringify(currentData)) {
        observer.next(query(id));
      }
    });
  });
}

function query(id) {
  const data = store.getState().football.data;
  if (typeof id === 'number') {
    return data.filter(d => d.id === id)[0];
  } else if (Array.isArray(id)) {
    return data.filter(d => id.indexOf(d.id) > -1);
  } else {
    return data;
  }
}
