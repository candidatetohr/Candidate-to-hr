

async function test() {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Candidate',
      email: 'cand' + Date.now() + '@test.com',
      password: 'password123',
      role: 'candidate'
    })
  });
  const data = await res.json();
  console.log('Candidate Data:', data);

  const res2 = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Recruiter',
      email: 'rec' + Date.now() + '@test.com',
      password: 'password123',
      role: 'recruiter',
      company: 'Test Company'
    })
  });
  const data2 = await res2.json();
  console.log('Recruiter Data:', data2);
}

test();
