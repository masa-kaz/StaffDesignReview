import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { buttonPrimaryScenarios } from '@/scenarios/atoms/buttonPrimary'

describe('ButtonPrimary (scenario)', () => {
  it('default variant renders label', () => {
    const wrapper = mount(buttonPrimaryScenarios.component, {
      props: buttonPrimaryScenarios.variants.default.props,
    })
    expect(wrapper.text()).toContain('クリック')
  })

  it('longLabel variant renders long label', () => {
    const wrapper = mount(buttonPrimaryScenarios.component, {
      props: buttonPrimaryScenarios.variants.longLabel.props,
    })
    expect(wrapper.text()).toContain('とても長いラベル')
  })
})


