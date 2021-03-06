import React from 'react'
import PropTypes from 'prop-types'

import DatasetRefProps from '../../propTypes/datasetRefProps'
import ProfileProps from '../../propTypes/profile'

import ProfileBar from './ProfileBar'
import NoProfile from './NoProfile'
import Datasets from '../Datasets'
import PageTitle from '../PageTitle'
import Spinner from '../chrome/Spinner'
import ProfileEditorContainer from '../../containers/ProfileEditor'
import ReadOnly from '../ReadOnly'

import Base from '../Base'

const EDIT_PROFILE_MODAL = 'EDIT_PROFILE_MODAL'

export default class Profile extends Base {
  constructor (props) {
    super(props)
    this.state = {
      tabIndex: 0,
      noProfile: false
    };

    [
      'changeTabIndex',
      'handleGoBack',
      'handleAddDataset',
      'handleSetProfilePhoto',
      'handleShowEditProfileModal',
      'handleMessage',
      'setNoProfile'
    ].forEach((m) => { this[m] = this[m].bind(this) })
  }

  componentWillMount () {
    if (!this.props.peer && !this.props.sessionProfileID) {
      this.props.loadSessionProfile()
    } else if (!this.props.profileID) {
      this.props.loadProfileByName(this.props.peername).then((action) => {
        if (action.type === 'PROFILE_FAILURE') {
          this.setState({ noProfile: true })
        }
      })
    } else if (!this.props.profile) {
      this.props.loadProfileById(this.props.profileID).then(() => {
        this.props.loadDatasets(this.props.profileID, 1, 30)
      })
    } else if (this.props.datasets.length === 0 && !this.props.noDatasets) {
      this.props.loadDatasets(this.props.profileID, 1, 30)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.noProfile) {
      return
    }
    if (!nextProps.peer && this.props.sessionProfileID !== nextProps.sessionProfileID) {
      this.props.loadSessionProfile()
    } else if (this.props.peername !== nextProps.peername) {
      this.props.loadProfileByName(nextProps.peername).then((action) => {
        if (action.type === 'PROFILE_FAILURE') {
          this.setState({ noProfile: true })
        }
      })
    } else if (this.props.profileID !== nextProps.profileID) {
      this.props.loadProfileById(nextProps.profileID).then(() => {
        this.props.loadDatasets(nextProps.profileID, 1, 30)
      })
    } else if (!nextProps.datasets.length === 0 && !this.props.noDatasets) {
      this.props.loadDatasets(nextProps.profileID, 1, 30)
    }
  }

  setNoProfile (error = '') {
    if (error) {
      this.setState({ noProfile: true })
    }
  }

  handleGoBack () {
    this.props.goBack()
  }

  changeTabIndex (index) {
    this.setState({ tabIndex: index })
  }

  handleSetProfilePhoto (files) {
    this.props.setProfilePhoto(files)
  }

  handleShowEditProfileModal () {
    this.props.showModal(EDIT_PROFILE_MODAL, this, this.props.profile, true, false)
  }

  handleAddDataset (currentName, newName, path) {
    this.props.addDataset(path, newName, '', '').then(() => {
      this.props.loadDatasets(this.props.profileID)
      this.props.hideModal()
    })
  }

  modal (name, data = {}) {
    switch (name) {
      case EDIT_PROFILE_MODAL:
        return <ProfileEditorContainer />
      default:
        return undefined
    }
  }

  handleMessage () {
    const { error, profile } = this.props
    let message = 'Profile has no Datasets'
    if (error.includes('routing: not found')) {
      message = `${profile.peername} is not currently connected`
    } else if (error) {
      message = 'Error loading Datasets. Check console for more info.'
    }
    return message
  }

  template (css) {
    const {
      profile,
      profileID,
      peername,
      sessionProfile,
      peer,
      sessionProfileID,
      datasets,
      loading } = this.props
    const { noProfile } = this.state

    if (!sessionProfileID) {
      return <ReadOnly />
    }

    return (
      <div className={css('wrap')}>
        <div className='col border' >
          <header>
            <PageTitle pageTitle='Profile' buttonText='Edit' onClick={!peer && this.handleShowEditProfileModal} />
          </header>
          {noProfile ? <NoProfile onGoBack={this.handleGoBack} peername={peername} sessionProfile={sessionProfile} /> : profile ? <ProfileBar profile={profile} peer={peer} setProfilePhoto={this.handleSetProfilePhoto} /> : <Spinner large />}
        </div>
        <div className='col border-right border-top border-bottom' >
          <header>
            <PageTitle pageTitle='' sectionTitle='datasets' />
          </header>
          <Datasets datasets={datasets} loading={loading} showPublishedStatus={profileID === sessionProfileID} />
        </div>
        <div className='col border-top'>
          <header />
        </div>
      </div>
    )
  }

  styles () {
    return {
      wrap: {
        display: 'flex'
      }
    }
  }
}

Profile.propTypes = {
  peer: PropTypes.bool,
  loadProfileById: PropTypes.func.isRequired,
  loadDatasets: PropTypes.func.isRequired,
  setProfilePoster: PropTypes.func,
  setProfilePhoto: PropTypes.func,

  profile: ProfileProps,
  peername: PropTypes.string,
  profileID: PropTypes.string,
  datasets: PropTypes.arrayOf(DatasetRefProps),
  noNamespace: PropTypes.bool,
  loading: PropTypes.bool,
  nextPage: PropTypes.number,
  fetchedAll: PropTypes.bool,
  goBack: PropTypes.func.isRequired

}

Profile.defaultProps = {
}
