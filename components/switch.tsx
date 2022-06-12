import React from 'react'

type ISwitch = React.FC<{ active: string|number, isMounted?: boolean }>

export const Switch: ISwitch = ({ active, children, isMounted=true}) => {
  const cases = children as ICase
  const c = React.Children.toArray(children)

  const nameMap = {}

  React.Children.forEach(children, element => {
    if (!React.isValidElement(element)) return

    const { name } = element.props
    nameMap[name] = element

  })

  return <>{ isMounted && nameMap[active]}</>
}


type ICase = React.FC<{ name: string|number }>


export const Case: ICase = ({ name, children }) => {
  name
  return <>{children}</>
}