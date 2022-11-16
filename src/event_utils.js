import 'bootstrap/dist/css/bootstrap.min.css';  
import {Container , Alert} from 'react-bootstrap'  
function Popup() {  
  return (  
    <div className="Popup">  
   <Container className='p-4'>  
   <Alert variant="success">Data is saved sucessfully</Alert>  
</Container>  
    </div>  
  );  
}  
export default Popup;  