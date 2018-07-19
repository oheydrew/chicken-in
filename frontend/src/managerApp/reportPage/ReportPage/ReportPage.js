import React from 'react'
import moment from 'moment'
import { AllShifts } from '../AllShifts/AllShifts'
import { dummyShifts } from '../../../dummyData'
import { Totals } from '../Totals/Totals'

class ReportPage extends React.Component {
  state = {
    allShifts: dummyShifts,
    paginationWeekStart: moment().weekday(1).hours(0).minutes(0).seconds(0),
    paginationWeekEnd: moment().weekday(1).hours(0).minutes(0).seconds(0).add(7, 'days'),
    filters: {
      employees: [...new Set(dummyShifts.map(shift => shift.name))],
      locations: [...new Set(dummyShifts.map(shift => shift.location))],
      status: [...new Set(dummyShifts.map(shift => shift.status))]
    }
  }

  sortBy = (event) => {
    const key = event.target.value
    this.setState((prevState) => {
      return ({
        allShifts: prevState.allShifts.sort((a, b) => {
          if (this.state.direction === 'asce') {
            if (a[key] < b[key]) return -1
            if (a[key] > b[key]) return 1
            return 0
          } else {
            if (b[key] < a[key]) return -1
            if (b[key] > a[key]) return 1
            return 0
          }
        }),
        direction: this.state.direction === 'asce'
          ? 'desc'
          : 'asce'
      })
    })
  }

  goBackOneWeek = () => {
    this.setState((prevState) => {
      return {
        paginationWeekStart: prevState.paginationWeekStart.subtract(7, 'days'),
        paginationWeekEnd: prevState.paginationWeekEnd.subtract(7, 'days')
      }
    }) 
  }

  goForwardOneWeek = () => {
    this.setState((prevState) => {
      return {
        paginationWeekStart: prevState.paginationWeekStart.add(7, 'days'),
        paginationWeekEnd: prevState.paginationWeekEnd.add(7, 'days')
      }
    }) 
  }

  toggleNameFilter = (event) => {
    const toggleName = event.target.name
    if (this.state.filters.employees.includes(toggleName)) {
      this.setState((prevState) => {
        return {
          filters: {
            ...prevState.filters,
            employees: prevState.filters.employees.filter((name) => {
              return name !== toggleName
            })
          }
        }
      })
    } else {
      this.setState((prevState) => {
        return {
          filters: {
            ...prevState.filters,
            employees: prevState.filters.employees.concat(toggleName)
          }
        }
      })
    }
  }

  toggleLocationFilter = (event) => {
    const toggleName = event.target.name
    if (this.state.filters.locations.includes(toggleName)) {
      this.setState((prevState) => {
        return {
          filters: {
            ...prevState.filters,
            locations: prevState.filters.locations.filter((name) => {
              return name !== toggleName
            })
          }
        }
      })
    } else {
      this.setState((prevState) => {
        return {
          filters: {
            ...prevState.filters,
            locations: prevState.filters.locations.concat(toggleName)
          }
        }
      })
    }
  }

  toggleStatusFilter = (event) => {
    const toggleName = event.target.name
    if (this.state.filters.status.includes(toggleName)) {
      this.setState((prevState) => {
        return {
          filters: {
            ...prevState.filters,
            status: prevState.filters.status.filter((name) => {
              return name !== toggleName
            })
          }
        }
      })
    } else {
      this.setState((prevState) => {
        return {
          filters: {
            ...prevState.filters,
            status: prevState.filters.status.concat(toggleName)
          }
        }
      })
    }
  }

  render () {
    console.log(this.state.filters.status)
    return (
      <div>
        <h1>Report Page</h1>
        <h2>Filters</h2>
        {[...new Set(this.state.allShifts.map(shift => shift.name))].map((name, index) => {
          return (
            <div key={index}>
              <input type="checkbox" id={name + index} name={name} value={name} defaultChecked onChange={this.toggleNameFilter}></input>
              <label>{name}</label>
            </div>
          )
        })}
        {[...new Set(this.state.allShifts.map(shift => shift.location))].map((location, index) => {
          return (
            <div key={index}>
              <input type="checkbox" id={location + index} name={location} value={location} defaultChecked onChange={this.toggleLocationFilter}></input>
              <label>{location}</label>
            </div>
          )
        })}
        {[...new Set(this.state.allShifts.map(shift => shift.status))].map((status, index) => {
          return (
            <div key={index}>
              <input type="checkbox" id={status + index} name={status} value={status} defaultChecked onChange={this.toggleStatusFilter}></input>
              <label>{status}</label>
            </div>
          )
        })}
        <Totals shifts={this.state.allShifts.filter((shift) => {
          const dateFilter = shift.date >= this.state.paginationWeekStart && shift.date < this.state.paginationWeekEnd
          const employeeFilter = this.state.filters.employees.includes(shift.name)
          const locationFilter = this.state.filters.locations.includes(shift.location)
          const statusFilter = this.state.filters.status.includes(shift.status)
          return dateFilter && employeeFilter && locationFilter && statusFilter
        })}/>
        <button value="date" onClick={this.sortBy}>Date</button>
        <button value="name" onClick={this.sortBy}>Name</button>
        <button value="location" onClick={this.sortBy}>Location</button>
        <button value="totalPay" onClick={this.sortBy}>Total Pay</button>
        <br/>
        {this.state.paginationWeekStart.format('MMMM Do')}
        <button onClick={this.goBackOneWeek}>Previous Week</button>
        <button onClick={this.goForwardOneWeek}>Next Week</button>
        {this.state.paginationWeekStart.format('MMMM Do')}
        <AllShifts shifts={this.state.allShifts.filter((shift) => {
          const dateFilter = shift.date >= this.state.paginationWeekStart && shift.date < this.state.paginationWeekEnd
          const employeeFilter = this.state.filters.employees.includes(shift.name)
          const locationFilter = this.state.filters.locations.includes(shift.location)
          const statusFilter = this.state.filters.status.includes(shift.status)
          return dateFilter && employeeFilter && locationFilter && statusFilter
        })}/>
      </div>
    )
  }
}

export { ReportPage }
