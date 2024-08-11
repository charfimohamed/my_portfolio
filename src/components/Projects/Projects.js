import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { ThemeContext } from '../../contexts/ThemeContext';
import { fetchProjectsData } from '../../data/projectsData';  // Adjust the path as necessary
import { HiArrowRight } from "react-icons/hi";

import './Projects.css';
import SingleProject from './SingleProject/SingleProject';
import {Grid} from "@material-ui/core";

function Projects() {
    const { theme } = useContext(ThemeContext);
    const [projectsData, setProjectsData] = useState([]);  // Initialize as an empty array

    useEffect(() => {
        const getProjectsData = async () => {
            const data = await fetchProjectsData();  // Fetch data when the component mounts
            setProjectsData(data);  // Set the fetched data to the state
        };

        getProjectsData();
    }, []);  // Empty dependency array ensures this runs only once when the component mounts

    const useStyles = makeStyles(() => ({
        viewAllBtn: {
            color: theme.tertiary,
            backgroundColor: theme.primary,
            transition: 'color 0.2s',
            "&:hover": {
                color: theme.secondary,
                backgroundColor: theme.primary,
            }
        },
        viewArr: {
            color: theme.tertiary,
            backgroundColor: theme.secondary70,
            width: '40px',
            height: '40px',
            padding: '0.5rem',
            fontSize: '1.05rem',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            "&:hover": {
                color: theme.tertiary,
                backgroundColor: theme.secondary,
            }
        },
    }));

    const classes = useStyles();

    return (
        <>
            {projectsData.length > 0 && (  // Check that projectsData has been fetched
                <div className="projects" id="projects" style={{ backgroundColor: theme.secondary }}>
                    <div className="projects--header">
                        <h1 style={{ color: theme.primary }}>Projects</h1>
                    </div>
                    <div className="projects--body">
                        <div className="projects--bodyContainer">
                            <Grid className="project-grid" container direction="row" alignItems="center" justifyContent="center">
                                {projectsData.map(project => (
                                    <SingleProject
                                        theme={theme}
                                        key={project.id}
                                        id={project.id}
                                        name={project.projectName}
                                        desc={project.projectDesc}
                                        tags={project.tags}
                                        code={project.code}
                                        demo={project.demo}
                                        image={project.image}
                                    />
                                ))}
                            </Grid>
                        </div>

                        {/*projectsData.length > 4 && (
                            <div className="projects--viewAll">
                                <Link to="/projects">
                                    <button className={classes.viewAllBtn}>
                                        View All
                                        <HiArrowRight className={classes.viewArr} />
                                    </button>
                                </Link>
                            </div>
                        )*/}
                    </div>
                </div>
            )}
        </>
    );
}

export default Projects;
