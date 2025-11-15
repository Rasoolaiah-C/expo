pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        script {
          // Prefer npm ci in CI if package-lock.json exists
          if (fileExists('package-lock.json')) {
            sh 'npm ci'
          } else {
            sh 'npm install'
          }
        }
      }
    }

    stage('Test') {
      steps {
        // Run tests but don't fail the pipeline on optional coverage tasks
        sh 'npm test --silent'
      }
    }

    stage('Build (optional)') {
      when {
        expression { return env.BUILD_DOCKER == 'true' }
      }
      steps {
        script {
          // Build a local Docker image; pushing requires credentials and additional setup
          sh 'docker build -t ${JOB_NAME}:${BUILD_NUMBER} .'
        }
      }
    }
  }

  post {
    always {
      junit '**/test-results/*.xml'
      archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
      echo "Build status: ${currentBuild.currentResult}"
    }
    failure {
      mail to: 'dev-team@example.com', subject: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}", body: "See Jenkins console output: ${env.BUILD_URL}"
    }
  }
}
