function generateAuthError(message) {
    switch (message) {
        case "EMAIL_EXISTS":
            return "Пользователь с таким Email уже существует"
        case "INVALID_PASSWORD":
            return "Email или пароль введены некорректно"
        default:
            throw new Error("слишком много попыток входа")
    }
}

export default generateAuthError
