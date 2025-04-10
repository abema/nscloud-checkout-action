import {getCheckoutInfo} from './main'

describe('getCheckoutInfo', () => {
  it('throws error when ref and commit are both empty', () => {
    expect(() => {
      getCheckoutInfo('', '')
    }).toThrow('Args ref and commit cannot both be empty')
  })

  it('uses commit when ref is empty', () => {
    const commit = '1234567890abcdef1234567890abcdef12345678'
    const result = getCheckoutInfo('', commit)
    expect(result).toEqual({
      ref: commit,
      startPoint: undefined
    })
  })

  it('handles refs/heads/ correctly', () => {
    const ref = 'refs/heads/main'
    const result = getCheckoutInfo(ref, '')
    expect(result).toEqual({
      ref: 'main',
      startPoint: 'refs/remotes/origin/main'
    })
  })

  it('handles refs/pull/ correctly with PR number', () => {
    const ref = 'refs/pull/123/merge'
    const result = getCheckoutInfo(ref, '')
    expect(result).toEqual({
      ref: 'refs/pull/123/head',
      startPoint: undefined
    })
  })

  it('handles refs/pull/ correctly without PR number', () => {
    const ref = 'refs/pull/'
    const result = getCheckoutInfo(ref, '')
    expect(result).toEqual({
      ref: 'refs/pull/',
      startPoint: undefined
    })
  })

  it('handles other refs/ correctly', () => {
    const ref = 'refs/tags/v1.0.0'
    const result = getCheckoutInfo(ref, '')
    expect(result).toEqual({
      ref: 'refs/tags/v1.0.0',
      startPoint: undefined
    })
  })

  it('handles case insensitivity for ref', () => {
    const ref = 'ReFs/HeAdS/main'
    const result = getCheckoutInfo(ref, '')
    expect(result).toEqual({
      ref: 'main',
      startPoint: 'refs/remotes/origin/main'
    })
  })

  it('prioritizes ref over commit when both are provided', () => {
    const ref = 'refs/heads/main'
    const commit = '1234567890abcdef1234567890abcdef12345678'
    const result = getCheckoutInfo(ref, commit)
    expect(result).toEqual({
      ref: 'main',
      startPoint: 'refs/remotes/origin/main'
    })
  })
})