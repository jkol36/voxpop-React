import React, { Component } from "react"
import { connect } from "react-redux"
import { /* Grid, */ Icon, Input, Header } from "semantic-ui-react"
import { SEARCH_CONTENT } from "../../actions/types"
import { DateRangePicker } from "react-dates"
import moment from "moment"

import "./ScoreboardHeader.css"
import PropTypes from "prop-types"
// import ReactTooltip from "react-tooltip"

class ScoreboardHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: "",
      startDate: moment(),
      endDate: moment(),
      focusedInput: null,
      showCalendar: false,
      sortByAsc: false
    }
  }

  handleInputChange = e => {
    this.setState({ searchTerm: e.target.value })
  }

  toggleCalendarVisibility = () => {
    this.setState({ showCalendar: !this.state.showCalendar })
  }

  toggleSorting = () => {
    this.setState({ sortByAsc: !this.state.sortByAsc }, () =>
      this.clickSearch()
    )
  }

  clickSearch = () => {
    // this.props.filterContent(this.state.searchTerm);
    const { startDate, endDate, showCalendar, sortByAsc } = this.state
    const searchTerm = showCalendar ? "" : this.state.searchTerm
    const searchBy = showCalendar ? "date_range" : ""

    const dateRange = showCalendar
      ? {
          from: startDate.format("YYYY-MM-DD").toString(),
          to: endDate.format("YYYY-MM-DD").toString()
        }
      : {}
    const sort = sortByAsc ? "ASC" : "DESC"
    const pageFilter = { searchTerm, searchBy, dateRange, sort }
    this.props.handleFilterChange(pageFilter)
  }

  handleDateRangeChange = ({ startDate, endDate }) => {
    this.setState({
      startDate,
      endDate
    })
  }

  render = () => {
    const {
      startDate,
      endDate,
      focusedInput,
      showCalendar
      // sortByAsc
    } = this.state
    const display = showCalendar ? "block" : "none"
    // const sortIcon = sortByAsc ? "sort amount up" : "sort amount down"
    // const sortingTip = !sortByAsc ? "ascending" : "descending"
    return (
      <div>
        <div className="scoreboard-rankings-header-row">
          <Header className="textFont" size="large" textAlign="center" inverted>
            Top Posts
          </Header>
          <div style={{ marginTop: "-45px" }}>
            <Icon
              link
              name="calendar"
              size="big"
              inverted
              onClick={() => this.toggleCalendarVisibility()}
              data-tip={`Filter by date range`}
              color={showCalendar ? "green" : null}
            />
            <Icon link name="filter" size="big" inverted />
            <Input
              placeholder="Search..."
              onChange={this.handleInputChange}
              icon={
                <Icon
                  name="search"
                  inverted
                  circular
                  link
                  onClick={() => this.clickSearch()}
                />
              }
            />
          </div>
          <div style={{ marginLeft: 38, display }}>
            <DateRangePicker
              isOutsideRange={() => false}
              startDate={startDate} // momentPropTypes.momentObj or null,
              startDateId="startDateRange" // PropTypes.string.isRequired,
              endDate={endDate} // momentPropTypes.momentObj or null,
              endDateId="endDateRange" // PropTypes.string.isRequired,
              onDatesChange={this.handleDateRangeChange} // PropTypes.func.isRequired,
              focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired
            />
          </div>
        </div>
      </div>
    )
    /* return (
      <Grid.Row columns={1} className="scoreboard-rankings-header-row">
        <Grid.Column width={16} className="scoreboard-rankings-header-column">
          <div className="scoreboard-rankings-header">
            <Header className="textFont" size="large" textAlign="center" inverted>
              Top Posts
            </Header>
            <center>
              <h3>Top Posts</h3>
            </center>
            <div className="scoreboard-rankings-icons">
              <Grid>
                <Grid.Row>
                  <div style={{ marginTop: 10 }}>
                    <Icon
                      data-for="sortby"
                      data-tip={`Sort rankings by ${sortingTip}`}
                      link
                      name={sortIcon}
                      size="big"
                      onClick={() => this.toggleSorting()}
                    />
                    <ReactTooltip id="sortby" />
                  </div>
                  <div className="ui icon input">
                    <Input
                      icon={
                        <Icon
                          name="search"
                          inverted
                          circular
                          link
                          onClick={() => this.clickSearch()}
                        />
                      }
                      placeholder="Search..."
                      onChange={this.handleInputChange}
                      style={{
                        height: "46px",
                        width: "285px",
                        marginRight: "5px"
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Icon
                      data-for="calendarOption"
                      data-tip={`Filter by date range`}
                      color={showCalendar ? "green" : null}
                      link
                      name="calendar"
                      size="big"
                      onClick={() => this.toggleCalendarVisibility()}
                    />

                    <ReactTooltip id="calendarOption" />
                  </div>
                </Grid.Row>
                <Grid.Row style={{ display }}>
                  <div style={{ marginLeft: 38 }}>
                    <DateRangePicker
                      isOutsideRange={() => false}
                      startDate={startDate} // momentPropTypes.momentObj or null,
                      startDateId="startDateRange" // PropTypes.string.isRequired,
                      endDate={endDate} // momentPropTypes.momentObj or null,
                      endDateId="endDateRange" // PropTypes.string.isRequired,
                      onDatesChange={this.handleDateRangeChange} // PropTypes.func.isRequired,
                      focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                      onFocusChange={focusedInput =>
                        this.setState({ focusedInput })
                      } // PropTypes.func.isRequired
                    />
                  </div>
                </Grid.Row>
              </Grid>
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    ) */
  }
}

const mapDispatchToProps = dispatch => ({
  filterContent: searchTerm => {
    dispatch({
      type: SEARCH_CONTENT,
      payload: {
        searchTerm
      }
    })
  }
})

ScoreboardHeader.propTypes = {
  handleFilterChange: PropTypes.func.isRequired
}

export default connect(
  null,
  mapDispatchToProps
)(ScoreboardHeader)
