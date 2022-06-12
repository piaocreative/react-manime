export enum CameraActions {
  SetCamera="SetCamera", 
}
export const SetCamera = (camera: any) => ({
  type: CameraActions.SetCamera,
  camera
});
