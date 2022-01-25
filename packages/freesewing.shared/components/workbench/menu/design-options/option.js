import { linkClasses, Chevron } from 'shared/components/navigation/primary.js'
import PercentOption from 'shared/components/workbench/inputs/design-option-percentage'
import { formatMm, formatPercentage, optionType } from 'shared/utils.js'

const values = {
  pct: props => {
    const val = (typeof props.gist?.options?.[props.option] === 'undefined')
      ? props.pattern.config.options[props.option].pct/100
      : props.gist.options[props.option]
    return (
      <span className={
        val=== props.pattern.config.options[props.option].pct/100
          ? 'text-secondary'
          : 'text-accent'
      }>
        {formatPercentage(val)}
        {props.pattern.config.options[props.option]?.toAbs
          ? ' | ' +formatMm(props.pattern.config.options[props.option]?.toAbs(val, props.gist))
          : null
        }
      </span>
    )
  }
}

const Tmp = props => <p>not yet</p>

const inputs = {
  pct: PercentOption,
  bool: Tmp,
  count: Tmp,
  deg: Tmp,
  list: Tmp,
  mm: Tmp,
  constant: Tmp,
}


const Option = props => {
  const type = optionType(props.pattern.config.options[props.option])
  const Input = inputs[type]
  const Value = values[type]

  return (
    <li className="flex flex-row">
      <details className="grow">
        <summary className={`
          flex flex-row
          px-2
          text-base-content
          sm:text-neutral-content
          hover:cursor-row-resize
          items-center
        `}>
          <div className={`
            grow pl-2 border-l-2
            ${linkClasses}
            hover:border-secondary
            sm:hover:border-secondary-focus
            text-base-content sm:text-neutral-content
          `}>
            <span className={`
              text-3xl mr-2 inline-block p-0 leading-3
              translate-y-3
            `}>
              <>&deg;</>
            </span>
            <span>
              { props.app.t(`options.${props.pattern.config.name}.${props.option}.title`) }
            </span>
          </div>
          <Value type={type} {...props} />
          <Chevron w={6} m={3}/>
        </summary>
        <Input {...props} />
      </details>
    </li>
  )
}

export default Option
