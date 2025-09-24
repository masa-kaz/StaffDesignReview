import ButtonPrimary from '@/components/atoms/ButtonPrimary.vue'

export type ButtonPrimaryVariantName = 'default' | 'longLabel'

export const buttonPrimaryScenarios = {
  component: ButtonPrimary,
  variants: {
    default: {
      props: { label: 'クリック' },
    },
    longLabel: {
      props: { label: 'とても長いラベルでボタンのレイアウト確認' },
    },
  },
} as const

export type ButtonPrimaryScenario = typeof buttonPrimaryScenarios
export type ButtonPrimaryProps = typeof buttonPrimaryScenarios.variants.default.props


