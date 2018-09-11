import { WDFContainer } from '../wdf.jsx';
import { WDFConcedeContainer } from '../wdf-concede.jsx';
import connect from '../connect';

export const MixWDFContainer = connect('wdf', WDFContainer, 'mi');
export const MixWDFConcedeContainer = connect(
  'let_wdf',
  WDFConcedeContainer,
  'mi'
);
