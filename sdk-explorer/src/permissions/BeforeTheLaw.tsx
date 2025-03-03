import { editDocument, publishDocument } from '@sanity/sdk'
import { useApplyActions, usePermissions } from '@sanity/sdk-react/hooks'

import './fonts.css'
import './paramour.css'

export default function BeforeTheLaw() {
  const beforeTheLaw = {
    _id: 'c8987e1f-cfd1-4bb7-a996-2191cc1492e5',
    _type: 'book',
  }
  const canEdit = usePermissions(editDocument(beforeTheLaw))
  const canPublish = usePermissions(publishDocument(beforeTheLaw))

  const apply = useApplyActions()

  return (
    <>
      <article className='pi0 pbe6'>
        <header className='league relative flex align-items-center justify-content-center si-100vw sb-100vh mbe6'>
          <h1 className='absolute text8 leading0 uppercase tracking-2'>
            Franz
            <br />
            Kafka
          </h1>
          <h2 className='absolute text6 leading0 uppercase tracking-1 text-center'>
            Before the Law
          </h2>
        </header>

        <section className='belleza text1 m-auto text-justify grid gap2'>
          <p className='text-center pbe3'>1</p>
          <p>
            <span className='uppercase'>Before the law</span> sits a gatekeeper.
            To this gatekeeper comes a man from the country who asks to gain
            entry into the law. But the gatekeeper says that he cannot grant him
            entry at the moment.
          </p>
          <p>
            The man thinks about it and then asks if he will be allowed to come
            in later on. “It is possible,” says the gatekeeper, “but not now.”
          </p>
          {!canEdit.allowed ? (
            <>
              <p style={{ color: 'goldenrod' }}>
                It appears as though the man from the country cannot edit the
                document in question. The gatekeeper tells him:
              </p>
              <figure
                className='p4 mb0 border1 borer-solid'
                style={{ borderColor: 'gainsboro' }}
              >
                {JSON.stringify(canEdit.message, null, 2)}
              </figure>
            </>
          ) : (
            <>
              <p className='text-center pb3'>2</p>
              <p>
                The man from the country has not expected such difficulties: the
                law should always be accessible for everyone, he thinks, but as
                he now looks more closely at the gatekeeper in his fur coat, at
                his large pointed nose and his long, thin, black Tartar’s beard,
                he decides that it would be better to wait until he gets
                permission to go inside. The gatekeeper gives him a stool and
                allows him to sit down at the side in front of the gate.
              </p>
              <p>
                There he sits for days and years. He makes many attempts to be
                let in, and he wears the gatekeeper out with his requests.
              </p>
              {!canPublish.allowed ? (
                <>
                  <p style={{ color: 'goldenrod' }}>
                    It seems that the problem is that the man from the country
                    does not have permission to publish this document. The
                    gatekeeper tells him:
                  </p>
                  <figure
                    className='p4 mb0 border1 borer-solid'
                    style={{ borderColor: 'gainsboro' }}
                  >
                    {JSON.stringify(canPublish.message, null, 2)}
                  </figure>
                </>
              ) : (
                <>
                  <p className='text-center pb3'>3</p>
                  <p>
                    The gatekeeper often interrogates him briefly, questioning
                    him about his homeland and many other things, but they are
                    indifferent questions, the kind great men put, and at the
                    end he always tells him once more that he cannot let him
                    inside yet. The man, who has equipped himself with many
                    things for his journey, spends everything, no matter how
                    valuable, to win over the gatekeeper. The latter takes it
                    all but, as he does so, says, “I am taking this only so that
                    you do not think you have failed to do anything.”
                  </p>
                  <p>
                    Finally, the main from the country grows impatient, and,
                    rising to his feet, he tells the gatekeeper, "I exist for
                    customers and I have a great sense of urgency! I am now
                    going to publish this document!"
                  </p>
                </>
              )}
            </>
          )}
          <div className='pb3'>
            <button
              disabled={!canPublish.allowed}
              onClick={() => apply(publishDocument(beforeTheLaw))}
              className={`p0 radius2 ${!canPublish.allowed ? 'opacity-25 cursor-not-allowed' : null}`}
              style={{ backgroundColor: 'goldenrod' }}
              title={
                canPublish.allowed ? 'Publish the Document' : canPublish.message
              }
            >
              Publish the Document
            </button>
          </div>
        </section>
      </article>
    </>
  )
}
