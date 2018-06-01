import React from 'react'
import PropTypes from 'prop-types'

function combineDispatch(one, two) {
  return action => {
    one(action)
    two(action)
  }
}

function combineStateComponents(Acc, StateComponent) {
  function FilteredTodoState({ children }) {
    // TODO Cleanup this mess
    return (
      <StateComponent>
        {({ dispatch, state, name }) =>
          Acc ? (
            <Acc>
              {({ dispatch: accDispatch, state: accState, name: accName }) =>
                children({
                  dispatch: combineDispatch(dispatch, accDispatch),
                  state: { ...(accName ? { [accName]: accState } : accState), [name]: state },
                })
              }
            </Acc>
          ) : (
            children({ dispatch, state: { [name]: state } })
          )
        }
      </StateComponent>
    )
  }
  FilteredTodoState.propTypes = {
    children: PropTypes.func.isRequired,
  }

  return FilteredTodoState
}

export function combineStates(...states) {
  return states.reduce(combineStateComponents)
}
