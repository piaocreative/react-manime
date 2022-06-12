import dynamic from 'next/dynamic';
const ReactDom = dynamic(()=>import('react-dom'))
import { LoadingModal } from '../components/LoadingModal';

export default state => {
  if (!document) return false;
  const layoutPortal = document.getElementById('layoutPortal');
  let loadingModal = document.getElementById('loadingModal');

  if (state) {
    if (!loadingModal) {
      ReactDOM.render(<LoadingModal isLoading={true} />, layoutPortal);
    }
  } else {
    if (loadingModal) {
      // layoutPortal.removeChild(loadingModal);
      ReactDOM.unmountComponentAtNode(layoutPortal);
    }
  }
}
