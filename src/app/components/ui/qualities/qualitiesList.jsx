import React from "react"
import PropTypes from "prop-types"
import Quality from "./quality"
import { useQualityContext } from "../../../../hooks/useQuality"

const QualitiesList = ({ qualities }) => {
    const { getQual, isLoadingQual } = useQualityContext()
    const qualsArr = qualities?.map((quality) => getQual(quality))
    return (
        <>
            {!isLoadingQual &&
                qualsArr?.map((qual) => <Quality key={qual._id} {...qual} />)}
        </>
    )
}

QualitiesList.propTypes = {
    qualities: PropTypes.array
}

export default QualitiesList
