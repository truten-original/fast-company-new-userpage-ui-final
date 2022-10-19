import React, { useEffect, useState } from "react"
import { validator } from "../../utils/validator"
import TextField from "../common/form/textField"
import SelectField from "../common/form/selectField"
import RadioField from "../common/form/radioField"
import MultiSelectField from "../common/form/multiSelectField"
import CheckBoxField from "../common/form/checkBoxField"
import { useQualityContext } from "../../../hooks/useQuality"
import { useProfession } from "../../../hooks/useProfession"
import { useAuth } from "../../../hooks/useAuth"
import { useHistory, useParams } from "react-router-dom"

const RegisterForm = () => {
    const { params } = useParams()
    console.log(params)
    const history = useHistory()
    const { signUp } = useAuth()
    const [data, setData] = useState({
        email: "",
        name: "",
        password: "",
        profession: "",
        sex: "male",
        qualities: [],
        licence: false
    })
    const { quals, isLoadingQuals } = useQualityContext()
    const { professions, isLoading } = useProfession()
    const [errors, setErrors] = useState({})
    const getProfessionById = (id) => {
        const prof = professions.find((item) => item._id === id)
        return prof._id
    }
    const getQualities = (elements) => {
        const qualitiesArray = []
        for (let i = 0; i < elements.length; i++) {
            const currentQual = elements[i]
            for (let i = 0; i < quals.length; i++) {
                if (quals[i]._id === currentQual.value) {
                    qualitiesArray.push(quals[i]._id)
                }
            }
        }
        return qualitiesArray
    }

    const professionsList = professions.map((professionName) => ({
        label: professionName.name,
        value: professionName._id
    }))
    const qualitiesList = quals.map((optionName) => ({
        value: optionName._id,
        label: optionName.name,
        color: optionName.color
    }))
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }))
    }
    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "имя обязательно для заполнения"
            },
            min: {
                message: "имя должно состоять мимнимум из трех символов",
                value: 3
            }
        },
        password: {
            isRequired: {
                message: "Пароль обязателен для заполнения"
            },
            isCapitalSymbol: {
                message: "Пароль должен содержать хотя бы одну заглавную букву"
            },
            isContainDigit: {
                message: "Пароль должен содержать хотя бы одно число"
            },
            min: {
                message: "Пароль должен состоять минимум из 8 символов",
                value: 8
            }
        },
        profession: {
            isRequired: {
                message: "Обязательно выберите вашу профессию"
            }
        },
        licence: {
            isRequired: {
                message:
                    "Вы не можете использовать наш сервис без подтверждения лицензионного соглашения"
            }
        }
    }
    useEffect(() => {
        validate()
    }, [data])
    const validate = () => {
        const errors = validator(data, validatorConfig)
        setErrors(errors)
        return Object.keys(errors).length === 0
    }
    const isValid = Object.keys(errors).length === 0

    const handleSubmit = async (e) => {
        e.preventDefault()
        const isValid = validate()
        if (!isValid) return
        const { profession, qualities } = data
        const newData = {
            ...data,
            profession: getProfessionById(profession),
            qualities: getQualities(qualities)
        }
        // try {
        await signUp(newData)
        history.push("/")
        // } catch (error) {
        //     setErrors(error)
        // }
    }
    if (!isLoading && !isLoadingQuals) {
        return (
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Электронная почта"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <TextField
                    label="Имя"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    error={errors.name}
                />
                <TextField
                    label="Пароль"
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                <SelectField
                    label="Выбери свою профессию"
                    defaultOption="Choose..."
                    options={professionsList}
                    name="profession"
                    onChange={handleChange}
                    value={data.profession}
                    error={errors.profession}
                />
                <RadioField
                    options={[
                        { name: "Male", value: "male" },
                        { name: "Female", value: "female" },
                        { name: "Other", value: "other" }
                    ]}
                    value={data.sex}
                    name="sex"
                    onChange={handleChange}
                    label="Выберите ваш пол"
                />
                <MultiSelectField
                    options={qualitiesList}
                    onChange={handleChange}
                    defaultValue={data.qualities}
                    name="qualities"
                    label="Выберите ваши качества"
                />
                <CheckBoxField
                    value={data.licence}
                    onChange={handleChange}
                    name="licence"
                    error={errors.licence}
                >
                    Подтвердить <a>лицензионное соглашение</a>
                </CheckBoxField>
                <button
                    className="btn btn-primary w-100 mx-auto"
                    type="submit"
                    disabled={!isValid}
                >
                    Submit
                </button>
            </form>
        )
    } else {
        return <h1>loading...</h1>
    }
}

export default RegisterForm
