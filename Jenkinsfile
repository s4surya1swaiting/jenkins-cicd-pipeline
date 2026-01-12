pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_NAME = 'myapp'
        MAVEN_OPTS = '-Dmaven.repo.local=.m2/repository'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    stages {
        stage('🔍 Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.BUILD_VERSION = "${env.BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
                }
            }
        }
        
        stage('🔨 Build') {
            steps {
                echo "Building version: ${env.BUILD_VERSION}"
                sh '''
                    ./mvnw clean compile -DskipTests
                '''
            }
        }
        
        stage('🧪 Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh './mvnw test -Dtest=*Test'
                    }
                    post {
                        always {
                            junit '**/target/surefire-reports/*.xml'
                        }
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh './mvnw test -Dtest=*IT'
                    }
                }
            }
        }
        
        stage('📊 Code Analysis') {
            when {
                expression { params.RUN_SONAR ?: false }
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh './mvnw sonar:sonar'
                }
            }
        }
        
        stage('📦 Package') {
            steps {
                sh './mvnw package -DskipTests'
                sh """
                    docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_VERSION} .
                    docker tag ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_VERSION} ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                """
            }
        }
        
        stage('🚀 Deploy to Dev') {
            when {
                branch 'develop'
            }
            steps {
                echo "Deploying to Development environment..."
                sh './scripts/deploy.sh dev'
            }
        }
        
        stage('🎯 Deploy to Staging') {
            when {
                branch 'release/*'
            }
            steps {
                echo "Deploying to Staging environment..."
                sh './scripts/deploy.sh staging'
            }
        }
        
        stage('🏭 Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
                echo "Deploying to Production environment..."
                sh './scripts/deploy.sh prod'
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            // slackSend channel: '#deployments', color: 'good', message: "Build ${env.BUILD_VERSION} succeeded"
        }
        failure {
            echo '❌ Pipeline failed!'
            // slackSend channel: '#deployments', color: 'danger', message: "Build ${env.BUILD_VERSION} failed"
        }
        always {
            cleanWs()
        }
    }
}
