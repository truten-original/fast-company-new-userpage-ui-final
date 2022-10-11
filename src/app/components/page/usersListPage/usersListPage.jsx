import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { paginate } from "../../../utils/paginate"
import Pagination from "../../common/pagination"
import GroupList from "../../common/groupList"
import SearchStatus from "../../ui/searchStatus"
import UserTable from "../../ui/usersTable"
import _ from "lodash"
import { useUser } from "../../../../hooks/useUsers"
import { useProfession } from "../../../../hooks/useProfession"
const UsersListPage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedProf, setSelectedProf] = useState()
    const [sortBy, setSortBy] = useState({ path: "name", order: "asc" })
    const pageSize = 8
    const { professions } = useProfession()
    const { users } = useUser()
    const handleDelete = (userId) => {
        // setUsers(users.filter((user) => user._id !== userId))
    }
    const handleToggleBookMark = (id) => {
        // const newArray = users.map((user) => {
        //     if (user._id === id) {
        //         return { ...user, bookmark: !user.bookmark }
        //     }
        //     return user
        // })
        // setUsers(newArray)
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [selectedProf, searchQuery])

    const handleProfessionSelect = (item) => {
        if (searchQuery !== "") setSearchQuery("")
        setSelectedProf(item)
    }
    const handleSearchQuery = ({ target }) => {
        setSelectedProf(undefined)
        setSearchQuery(target.value)
    }

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex)
    }
    const handleSort = (item) => {
        setSortBy(item)
    }
    if (users) {
        const filteredUsers =
            searchQuery !== ""
                ? users.filter(
                      (user) =>
                          user.name
                              .toLowerCase()
                              .indexOf(searchQuery.toLowerCase()) !== -1
                  )
                : selectedProf
                ? users.filter((user) => user.profession === selectedProf._id)
                : users

        const count = filteredUsers.length
        const sortedUsers = _.orderBy(
            filteredUsers,
            [sortBy.path],
            [sortBy.order]
        )
        const usersCrop = paginate(sortedUsers, currentPage, pageSize)
        const clearFilter = () => {
            setSelectedProf()
        }
        return (
            <div className="d-flex">
                {professions && (
                    <div className="d-flex flex-column flex-shrink-0 p-3">
                        <GroupList
                            selectedItem={selectedProf}
                            items={professions}
                            onItemSelect={handleProfessionSelect}
                        />
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={clearFilter}
                        >
                            {" "}
                            Очистить
                        </button>
                    </div>
                )}
                <div className="d-flex flex-column">
                    <SearchStatus length={count} />
                    <input
                        type="text"
                        name="searchQuery"
                        placeholder="Search..."
                        onChange={handleSearchQuery}
                        value={searchQuery}
                    />
                    {count > 0 && (
                        <UserTable
                            users={usersCrop}
                            onSort={handleSort}
                            selectedSort={sortBy}
                            onDelete={handleDelete}
                            onToggleBookMark={handleToggleBookMark}
                        />
                    )}
                    <div className="d-flex justify-content-center">
                        <Pagination
                            itemsCount={count}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        )
    }
    return "loading..."
}
UsersListPage.propTypes = {
    users: PropTypes.array
}

export default UsersListPage