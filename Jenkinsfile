pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        REGISTRY = 'santanu/bonstay-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                sh './gradlew clean build'
                junit 'build/test-results/**/*.xml'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    dockerImage = docker.build(REGISTRY + ":$BUILD_NUMBER")
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                sshagent(['staging-server-key']) {
                    sh 'ssh user@staging-server "docker pull ${REGISTRY}:latest && docker-compose up -d"'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline successfully completed.'
        }
        failure {
            echo 'Pipeline failed. Notification sent.'
        }
    }
}
