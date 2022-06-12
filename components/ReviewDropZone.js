import React from "react";
import Dropzone from "react-dropzone";
import style from "../static/components/MyDropZone.css";

export default class ReviewDropZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragEnter: false,
    };
  }

  render() {
    return (
        <Dropzone
          onDrop={this.props.onDrop}
          multiple={false}
          accept=""
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
                height: 'calc(100vh - 280px)',
                border: 'none'
              }}
            >
              { this.props.active === false ?
                <div className={style.onlyDesktopView} style={{display: this.props.active ? 'block' : 'none'}}>
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
                <div className = {style.dropzoneImageContainer}>
                  <input {...getInputProps()} />
                  <img src = {this.props.image} style={{objectFit: 'cover'}}/>
                </div>
              }
            </div>
          )}
        </Dropzone>
    );
  }
}
