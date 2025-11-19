pipeline {
    agent any
    
    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning code from GitHub...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    // Build your app's Docker image
                    sh 'docker build -t two-tier-app:latest .'
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo 'Stopping old container if running...'
                script {
                    sh 'docker stop two-tier-app || true'
                    sh 'docker rm two-tier-app || true'
                }
            }
        }
        
        stage('Run New Container') {
            steps {
                echo 'Running new container...'
                script {
                    sh 'docker run -d --name two-tier-app -p 80:80 two-tier-app:latest'
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Checking if container is running...'
                sh 'docker ps | grep two-tier-app'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}