import { showMessage } from "react-native-flash-message";

export const successMessage = ( msg:string, title?:string )=>{
    showMessage({
        message: title??"Success!",
        description: msg,
        type: "success",
        icon: { icon: "success", position: 'left' }, // Custom icon
        style: { paddingTop: '15%'}
    });
}
  
export const errorMessage = ( msg:string, title?:string )=>{
    showMessage({
        message: title??"Error!",
        description: msg,
        type: "danger",
        icon: { icon: "warning", position: 'left' }, // Custom icon
        style: { paddingTop: '15%'}
    });
}