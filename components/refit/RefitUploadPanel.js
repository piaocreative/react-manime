import React, { Component } from 'react';
import { DarkButton } from '../basic/buttons';
import CustomDropZone from '..//CustomDropZone';
import style from '../../static/components/refit/refit-review-upload-photo.module.css';
import log from '../../utils/logging'
class RefitUploadPanel extends Component {
  state = {
    status: false,
    imageFile: null,
    from: null,
    isLoading: false
  }

  localOnDrop = async (accepted, rejected) => {
    const { picUriId } = this.props;
    const { selectedIndex } = this.props.state;
    let key = null;
    // TODO: check single nail or all nails?
    if (selectedIndex >= 0) {
      key = `image${selectedIndex}Uri`;
    } else {
      log.info('[ERR in RefitUploadPanel] this should not happen');
      key = `image${selectedIndex}Uri`;
    }
    try {
      this.setState({isLoading: true});
      this.props.onDrop && await this.props.onDrop(accepted, rejected, key);
    } catch (err) {
      log.info('ERR in RefitUploadPanel err =>', err);
    }
    this.setState({ status: true, isLoading: false });
  }

  clickDoneBtnHandler = () => {
    const { onBack } = this.props;
    onBack && onBack();
  }

  componentDidMount() {
    log.info('RefitUploadPanel Didmount');
  }

  render () {
    const { image } = this.props;
    const { isLoading } = this.state;
    return (
      <>
        <div className={style.container} style={{padding: '16px'}}>
          <CustomDropZone
            isLoading={isLoading}
            onDrop={this.localOnDrop}
            active = {this.state.status}
            image={image}
          />
          <DarkButton
            passedClass={style.doneButton}
            style={{background: (isLoading) && '#f8f1ed', color: (isLoading) && '#213439'}}
            onClick={this.clickDoneBtnHandler}>
            {isLoading? 'UPLOADING...' : image ? 'DONE' : 'BACK' }
          </DarkButton>
        </div>
      </>
    );
  }
};

export default RefitUploadPanel;