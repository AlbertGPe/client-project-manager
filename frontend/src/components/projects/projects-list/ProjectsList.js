import React, { useEffect, useState } from 'react'
import projectService from '../../../services/projects'

function ProjectsList() {
  const [projects, setProjects] = useState([])

  useEffect(() => { //TODO ASYNC AWAIT
    projectService.list()
      .then((projects) => setProjects(projects))
      .catch((error) => console.error(error))
  }, [])
  
  return (
    <div>
      <h1>Projects List</h1>
      {projects.map((project) => <div key={project.id}>{project.name}</div> )}
    </div>
  )
}

export default ProjectsList