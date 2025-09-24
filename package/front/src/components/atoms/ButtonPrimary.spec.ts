import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonPrimary from './ButtonPrimary.vue'

describe('ButtonPrimary', () => {
  it('renders label and emits click', async () => {
    const wrapper = mount(ButtonPrimary, { props: { label: '押す' } })
    expect(wrapper.text()).toContain('押す')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})


