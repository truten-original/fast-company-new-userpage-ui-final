import React from "react"
import Select from "react-select"
import PropTypes from "prop-types"

const MultiSelectField = ({
    options,
    onChange,
    name,
    label,
    defaultValue,
    error
}) => {
    const optionsArray =
        !Array.isArray(options) && typeof options === "object"
            ? Object.values(options)
            : options.map((option) => ({
                  value: option._id || option.value,
                  label: option.name || option.label,
                  color: option.color || option.color
              }))
    console.log(error)
    const transformDefaultValue = (options, optionsArr) => {
        const currentPersonOptions = []
        for (const option of options) {
            for (const currentOption of optionsArr) {
                if (option === currentOption.value) {
                    currentPersonOptions.push(currentOption)
                }
            }
        }
        return currentPersonOptions
    }
    const currentPersonOptions = transformDefaultValue(
        defaultValue,
        optionsArray
    )
    const handleChange = (value) => {
        onChange({ name, value })
    }
    return (
        <div className="mb-4">
            <label className="form-label">{label}</label>
            <Select
                isMulti
                closeMenuOnSelect={false}
                defaultValue={currentPersonOptions}
                options={optionsArray}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange}
                name={name}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    )
}
MultiSelectField.propTypes = {
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.array,
    error: PropTypes.string
}

export default MultiSelectField
