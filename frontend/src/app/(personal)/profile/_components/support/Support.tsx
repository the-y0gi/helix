import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {}

const Support = (props: Props) => {
  const { t } = useTranslation()
  return (
    <div>{t("general.support")}</div>
  )
}

export default Support