import { mockExperimentalFeatures } from '../../test'
import { ExperimentalFeature } from '../tools/experimentalFeatures'
import { TrackingConsent, createTrackingConsentState } from './trackingConsent'

describe('createTrackingConsentState', () => {
  describe('with tracking_consent enabled', () => {
    beforeEach(() => {
      mockExperimentalFeatures([ExperimentalFeature.TRACKING_CONSENT])
    })

    it('creates a tracking consent state', () => {
      const trackingConsentState = createTrackingConsentState()
      expect(trackingConsentState).toBeDefined()
    })

    it('defaults to not granted', () => {
      const trackingConsentState = createTrackingConsentState()
      expect(trackingConsentState.isGranted()).toBeFalse()
    })

    it('can be created with a default consent state', () => {
      const trackingConsentState = createTrackingConsentState(TrackingConsent.GRANTED)
      expect(trackingConsentState.isGranted()).toBeTrue()
    })

    it('can be updated to granted', () => {
      const trackingConsentState = createTrackingConsentState()
      trackingConsentState.update(TrackingConsent.GRANTED)
      expect(trackingConsentState.isGranted()).toBeTrue()
    })

    it('notifies when the consent is updated', () => {
      const spy = jasmine.createSpy()
      const trackingConsentState = createTrackingConsentState()
      trackingConsentState.observable.subscribe(spy)
      trackingConsentState.update(TrackingConsent.GRANTED)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('can init a consent state if not defined yet', () => {
      const trackingConsentState = createTrackingConsentState()
      trackingConsentState.tryToInit(TrackingConsent.GRANTED)
      expect(trackingConsentState.isGranted()).toBeTrue()
    })

    it('does not init a consent state if already defined', () => {
      const trackingConsentState = createTrackingConsentState(TrackingConsent.GRANTED)
      trackingConsentState.tryToInit(TrackingConsent.NOT_GRANTED)
      expect(trackingConsentState.isGranted()).toBeTrue()
    })
  })

  describe('with tracking_consent disabled', () => {
    it('creates a tracking consent state', () => {
      const trackingConsentState = createTrackingConsentState()
      expect(trackingConsentState).toBeDefined()
    })

    it('is always granted', () => {
      let trackingConsentState = createTrackingConsentState()
      expect(trackingConsentState.isGranted()).toBeTrue()

      trackingConsentState = createTrackingConsentState(TrackingConsent.NOT_GRANTED)
      expect(trackingConsentState.isGranted()).toBeTrue()

      trackingConsentState = createTrackingConsentState()
      trackingConsentState.update(TrackingConsent.NOT_GRANTED)
      expect(trackingConsentState.isGranted()).toBeTrue()
    })
  })
})
