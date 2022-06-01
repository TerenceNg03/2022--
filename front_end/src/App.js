import React from 'react'
import { Select } from 'antd'
import useHash from './useHash'
import Basic from './examples/Basic'
import ViewScripts from './examples/ViewScript.js'

import './App.css'

const { Option } = Select
const examples = {
  basic: { name: '浙江大学医学院附属第二医院门诊病历', component: Basic },
  // basic: { name: '浙江大学医学院附属第二医院门诊病历', component: ViewScripts },

}

export default () => {
  const current = useHash() || 'basic'

  const renderExample = () => {
    const item = examples[current]
    if (!item || !item.component) {
      return <span style={{ color: 'red' }}>Error: example "{current}" not found.</span>
    }
    const Comp = item.component
    return (
      <React.Fragment>
        <h1>
          {item.name}
          <p className="example-description">{item.description}</p>
        </h1>
        <Comp />
      </React.Fragment>
    )
  }

  const handleVersionChange = ver => {
    if (ver === 'v3.x') {
      document.location = '/antd-form-builder/examples-v3'
    }
  }

  return (
    <div className="app">
      <div className="example-container">{renderExample()}</div>
    </div>
  )
}
