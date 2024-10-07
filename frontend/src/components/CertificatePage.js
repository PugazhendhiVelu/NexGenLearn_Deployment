import React from 'react';
import html2canvas from 'html2canvas';
import background from '../assests/certificate.png';

function CertificatePage() {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const name = params.get('name');
  const course = params.get('course');
  const instructor = params.get('instructor');
  const date = params.get('date');
  const styles = {
    container: {
      position: 'relative',
      width: '800px',
      height: '600px',
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: '10px auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    content: {
      position: 'absolute',
      textAlign: 'left',
      width: '100%',
      padding: '40px',
      maegin:0,
      fontFamily: 'Georgia, serif',
      color: '#333',
    },
    name: {
      fontSize: '32px',
      fontWeight: 'bold',
      textAlign: 'left',
      marginLeft: '30px',
      marginTop: '100px',
      marginBottom: '2px',
      color: '#111',
    },
    courseName: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginLeft: '50px',
      marginTop: '100px',
      marginBottom: '2px',
    },
    instructor: {
      fontSize: '16px',
      textAlign: 'left',
      marginLeft: '35px',
      marginTop: '200px',
      marginBottom: '-800px',
    },
    date: {
      fontSize: '16px',
      marginTop: '-240px',
      marginLeft: '350px',
    },
    downloadButton: {
      display: 'flex',
      margin: '20px auto', // Center the button and add margin
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      zIndex: '1000',
    },
  };

  const downloadCertificate = () => {
    const input = document.getElementById('certificate');
    html2canvas(input).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'certificate.png';
      link.click();
    });
  };

  return (
    <div>
      <div id="certificate" style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.name}>{name}</h2>
          <h3 style={styles.courseName}>{course}</h3>
        </div>
        <div style={styles.content}>
          <h3 style={styles.instructor}>{instructor}</h3>
        </div>
        <div>
          <p style={styles.date}>{date}</p>
        </div>
      </div>
      <button onClick={downloadCertificate} style={styles.downloadButton}>
        Download Certificate
      </button>
    </div>
  );
}

export default CertificatePage;
