import React from 'react'
import { cc } from 'utils/combineClasses'
import styles from './styles.module.scss'

interface Props {
  className?: string
}

interface Option {
  key: string
  value: string
}

interface MultiDropdownProps extends Props {
  options: Option[]
  value: Option[]
  onChange: (value: Option[]) => void
  disabled?: boolean
  pluralizeOptions: (value: Option[]) => string
}

const MultiDropdown = ({
  className,
  options,
  value,
  onChange,
  disabled,
  pluralizeOptions
}: MultiDropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const handleSelect = (option: Option) => {
    const isSelected = value.some(item => item.key === option.key)
    const newValue = isSelected
      ? value.filter(item => item.key !== option.key)
      : [...value, option]
    onChange(newValue)
  }

  return (
    <div className= { cc(styles.multiDropdownRoot, className) } >
    <div 
        className={ styles.dropdownHeader }
  onClick = { handleToggle }
    >
    { pluralizeOptions(value) }
    </div>

  {
    isOpen && (
      <div className={ styles.dropdownList }>
      {
        options.map(option => (
          <div 
              key= { option.key }
              className = {
            cc(
              styles.dropdownItem,
            value.some(item => item.key === option.key) && styles.selected
              )
      }
    onClick = {() => handleSelect(option)}
            >
  { option.value }
  </div>
          ))}
</div>
      )}
</div>
  )
}


export default MultiDropdown
