pipeline {
  agent {
    node {
      label 'local-docker-slave'
    }

  }
  stages {
    stage('Install') {
      steps {
          sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    /*stage('Deploy') {
      steps {
        sshagent(credentials: ['manime-co-staging']) {
          sh 'ssh -o StrictHostKeyChecking=no -l ec2-user 52.36.236.143 docker run --rm -itd -p 3000:3000 --name web-app-b web-app-b'
        }
      }
    }*/

  }
  environment {
    CI = 'true'
  }
}
