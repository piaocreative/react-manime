import React, { Fragment } from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import style from '../static/components/MyDropZone.module.css';
import StandardButton from '../components/styled/StandardButton';
import { Img } from '../components/styled/StyledComponents';
import { WhiteButton } from '../components/basic/buttons';

const TakePictureButton = styled(StandardButton)`
  position: fixed;
  bottom: 20px;
  max-width: 480px;
  height: 40px;
  left: 26px;
  background: #2C4349;
  color: #fff;
  font-size: 14px;
  width: calc(100% - 88px);
  transform: translate(-50%, 0);
  left: 50%;
  &:hover {
    background: #2C4349;
  }
`;

export default class MyDropzone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragEnter: false
    };
  }

  render() {
    const { onDrop, active, image, isLoading } = this.props;
    return (
        <Dropzone
          onDrop={onDrop}
          multiple={false}
          accept=''
          onDragEnter={() => this.setState({ isDragEnter: true })}
          onDragLeave={() => this.setState({ isDragEnter: false })}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className={
                this.state.isDragEnter ? style.fileDragEnter : style.originDrop
              }
              style={{
                height: (active && !isLoading) ? 'calc(100vh - 160px)' : '0px',
                border: 'none'
              }}
            >
              { active === false ?
                <div className={style.onlyDesktopView} style={{display: active ? 'block' : 'none'}}>
                  <input {...getInputProps()} />
                  <div className = {style.arc}>
                    <img src='/static/images/dropzone.svg'/>
                  </div>
                  {!this.state.isDragEnter ? (
                    <p>
                      Click to upload
                      <br />
                      or drop Image
                    </p>
                  ) : (
                    <p>Drop that file Here</p>
                  )}
                </div> :
                <div className={style.dropzoneImageContainer}>
                  <input {...getInputProps()} />
                  {
                    (image && !isLoading) &&
                    <img src={image} style={{objectFit: 'contain'}} alt='image' />
                  }
                </div>
              }
              <div className={style.onlyMobileView}>
              { active === false ?
                <TakePictureButton
                  position='absolute'
                  left='0'
                  bottom='-48px'
                  width='100%'
                  height='32px'
                  onClick={this.takePhotoHandler}>
                  <Img mr={2} src='/static/icons/camera-upload.svg' alt='camera' />
                  {isLoading ? 'UPLOADING...' : 'TAKE PICTURE'}
                </TakePictureButton> :
                <WhiteButton passedClass={style.retakeButton}>
                  OOPS RETAKE
                </WhiteButton>
              }
              </div>
            </div>
          )}
        </Dropzone>
    );
  }
}
