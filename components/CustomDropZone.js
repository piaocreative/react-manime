import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import style from '../static/components/custom-dropzone.module.css';
import { PrimaryButton, GrayButton } from '../components/basic/buttons';
import LoadingAnimation from '../components/LoadingAnimation';

const placeholderImageSrc = '/static/icons/camera-upload2.svg';

export default class CustomDropZone extends Component {
  state = {
    isDragEnter: false
  };

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.inputElement.click();
  }

  render() {
    const { isDragEnter } = this.state;
    return (
        <Dropzone
          onDrop={this.props.onDrop}
          multiple={false}
          accept=''
          onDragEnter={() => this.setState({ isDragEnter: true })}
          onDragLeave={() => this.setState({ isDragEnter: false })}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className={classNames(style.dropZonePanel, {
                [style.fileDragEnter]: isDragEnter,
                [style.originDrop]: !isDragEnter
              })}
              style={{
                border: '1px solid grey',
                background: (!this.props.isLoading && !this.props.active) && `url(${placeholderImageSrc}) 50% 50%`,
                backgroundSize: '100px',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {
              // (!this.props.image && !this.props.isLoading) ?
              //   <div className={style.onlyDesktopView} style={{display: this.props.active ? 'block' : 'none'}}>
              //     <input {...getInputProps()} />
              //     <div className = {style.arc}>
              //       <img src='/static/images/dropzone.svg'/>
              //     </div>
              //     {!isDragEnter ? (
              //       <p>
              //         Click to upload
              //         <br />
              //         or drop Image
              //       </p>
              //     ) : (
              //       <p>Drop that file Here</p>
              //     )}
              //   </div> :
                <>
                {
                  this.props.isLoading ?
                  <div style={{height: '100%', width: '100%'}}>
                    <LoadingAnimation isLoading={this.props.isLoading} background='transparent' />
                  </div> :
                
                  <div className = {style.dropzoneImageContainer}>
                    <input {...getInputProps()} />
                    
                    {!this.props.isLoading &&
                      <img src = {this.props.image} style={{objectFit: 'cover'}}/>
                    }
                  </div>
                }
                </>
              }
              <div className={style.onlyMobileView}>
              <GrayButton
                // ref={input => this.takePictureButton = input}
                style={{
                  position: 'absolute',
                  left: '-2px',
                  bottom: '-107.5px',
                  fontSize: '12px',
                  width: '100%'
                }}
                  >
                  <input style={{display: 'none'}}  ref={input => this.inputElement = input} />
                  {this.props.active === false ? 'TAKE PICTURE' : 'RETAKE'}
                </GrayButton>
              </div>
            </div>
          )}
        </Dropzone>
    );
  }
}
